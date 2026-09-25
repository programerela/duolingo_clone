import { Request, Response } from 'express';
import { query, withTransaction } from '../config/db';
import { HttpError } from '../utils/httpError';

export async function getLessonExercises(req: Request, res: Response) {
  const userId = req.user!.id;
  const lessonId = req.params.id;

  const lessonResult = await query<{
    id: string;
    title: string;
    status: string;
  }>(
    `
      SELECT
        l.id,
        l.title,
        COALESCE(ulp.status, 'LOCKED') AS status
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id
       AND ulp.user_id = $2
      WHERE l.id = $1
    `,
    [lessonId, userId]
  );

  const lesson = lessonResult.rows[0];

  if (!lesson) {
    throw new HttpError(404, 'Lesson not found');
  }

  if (lesson.status === 'LOCKED') {
    throw new HttpError(403, 'Lesson is locked');
  }

  const exercises = await query<{
    id: string;
    sort_order: number;
    type: string;
    instruction: string | null;
    prompt: string;
    correct_answer: string;
    metadata_json: Record<string, unknown>;
  }>(
    `
      SELECT
        id,
        sort_order,
        type,
        instruction,
        prompt,
        correct_answer,
        metadata_json
      FROM exercises
      WHERE lesson_id = $1
      ORDER BY sort_order
    `,
    [lessonId]
  );

  res.json({
    lesson: {
      id: lesson.id,
      title: lesson.title
    },
    exercises: exercises.rows.map((exercise) => ({
      id: exercise.id,
      sortOrder: exercise.sort_order,
      type: exercise.type,
      instruction: exercise.instruction,
      prompt: exercise.prompt,
      correctAnswer: exercise.correct_answer,
      metadata: exercise.metadata_json
    }))
  });
}

export async function completeLesson(req: Request, res: Response) {
  const userId = req.user!.id;
  const lessonId = req.params.id;
  const {
    correctAnswers,
    totalQuestions,
    energyStart,
    energyEnd
  } = req.body;
  const durationSeconds = req.body.durationSeconds ?? 0;

  const result = await withTransaction(async (client) => {
    const lessonResult = await client.query<{
      id: string;
      xp_reward: number;
      status: string;
      course_id: string;
    }>(
      `
        SELECT
          l.id,
          l.xp_reward,
          COALESCE(ulp.status, 'LOCKED') AS status,
          s.course_id
        FROM lessons l
        JOIN units u ON u.id = l.unit_id
        JOIN sections s ON s.id = u.section_id
        LEFT JOIN user_lesson_progress ulp
          ON ulp.lesson_id = l.id
         AND ulp.user_id = $2
        WHERE l.id = $1
        FOR UPDATE OF l
      `,
      [lessonId, userId]
    );

    const lesson = lessonResult.rows[0];

    if (!lesson) {
      throw new HttpError(404, 'Lesson not found');
    }

    if (lesson.status === 'LOCKED') {
      throw new HttpError(403, 'Lesson is locked');
    }

    const statsResult = await client.query<{
      energy_current: number;
      energy_max: number;
      streak_count: number;
      longest_streak: number;
      last_activity_date: string | null;
      timezone: string;
    }>(
      `
        SELECT
          us.energy_current,
          us.energy_max,
          us.streak_count,
          us.longest_streak,
          us.last_activity_date::text,
          u.timezone
        FROM user_stats us
        JOIN users u ON u.id = us.user_id
        WHERE us.user_id = $1
        FOR UPDATE OF us
      `,
      [userId]
    );

    const stats = statsResult.rows[0];

    if (!stats) {
      throw new HttpError(500, 'User stats are missing');
    }

    const accuracy = Number(((correctAnswers / totalQuestions) * 100).toFixed(2));
    const wrongAnswers = totalQuestions - correctAnswers;
    const calculatedEnergyStart = energyStart ?? stats.energy_current;
    const calculatedEnergyEnd = Math.min(
      stats.energy_max,
      Math.max(0, energyEnd ?? (calculatedEnergyStart - wrongAnswers))
    );
    const xpEarned = lesson.xp_reward;

    await client.query(
      `
        INSERT INTO lesson_attempts (
          user_id,
          lesson_id,
          total_questions,
          correct_answers,
          accuracy,
          xp_earned,
          duration_seconds,
          energy_start,
          energy_end,
          completed,
          completed_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, NOW())
      `,
      [
        userId,
        lessonId,
        totalQuestions,
        correctAnswers,
        accuracy,
        xpEarned,
        durationSeconds,
        calculatedEnergyStart,
        calculatedEnergyEnd
      ]
    );

    await client.query(
      `
        INSERT INTO user_lesson_progress (
          user_id,
          lesson_id,
          status,
          completion_count,
          best_accuracy,
          best_score,
          first_completed_at,
          last_completed_at
        )
        VALUES ($1, $2, 'COMPLETED', 1, $3, $4, NOW(), NOW())
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET
          status = 'COMPLETED',
          completion_count = user_lesson_progress.completion_count + 1,
          best_accuracy = GREATEST(
            COALESCE(user_lesson_progress.best_accuracy, 0),
            EXCLUDED.best_accuracy
          ),
          best_score = GREATEST(
            user_lesson_progress.best_score,
            EXCLUDED.best_score
          ),
          first_completed_at = COALESCE(
            user_lesson_progress.first_completed_at,
            NOW()
          ),
          last_completed_at = NOW()
      `,
      [userId, lessonId, accuracy, correctAnswers]
    );

    const orderedLessons = await client.query<{ id: string }>(
      `
        SELECT l.id
        FROM lessons l
        JOIN units u ON u.id = l.unit_id
        JOIN sections s ON s.id = u.section_id
        WHERE s.course_id = $1
        ORDER BY s.sort_order, u.sort_order, l.sort_order
      `,
      [lesson.course_id]
    );

    const lessonIndex = orderedLessons.rows.findIndex((row) => row.id === lessonId);
    const nextLesson = orderedLessons.rows[lessonIndex + 1];

    if (nextLesson) {
      await client.query(
        `
          INSERT INTO user_lesson_progress (user_id, lesson_id, status)
          VALUES ($1, $2, 'AVAILABLE')
          ON CONFLICT (user_id, lesson_id)
          DO UPDATE SET
            status = CASE
              WHEN user_lesson_progress.status = 'LOCKED' THEN 'AVAILABLE'
              ELSE user_lesson_progress.status
            END
        `,
        [userId, nextLesson.id]
      );
    }

    const localDateResult = await client.query<{ today: string }>(
      `SELECT (NOW() AT TIME ZONE $1)::date::text AS today`,
      [stats.timezone]
    );

    const today = localDateResult.rows[0].today;
    let newStreak = stats.streak_count;

    if (!stats.last_activity_date) {
      newStreak = 1;
    } else if (stats.last_activity_date === today) {
      newStreak = stats.streak_count;
    } else {
      const gapResult = await client.query<{ days: number }>(
        `SELECT ($1::date - $2::date)::int AS days`,
        [today, stats.last_activity_date]
      );

      newStreak = gapResult.rows[0].days === 1
        ? stats.streak_count + 1
        : 1;
    }

    const newLongestStreak = Math.max(stats.longest_streak, newStreak);

    await client.query(
      `
        UPDATE user_stats
        SET
          xp_total = xp_total + $2,
          streak_count = $3,
          longest_streak = $4,
          last_activity_date = $5,
          energy_current = $6,
          energy_updated_at = NOW(),
          lessons_completed = lessons_completed + 1
        WHERE user_id = $1
      `,
      [
        userId,
        xpEarned,
        newStreak,
        newLongestStreak,
        today,
        calculatedEnergyEnd
      ]
    );

    await client.query(
      `
        UPDATE user_courses
        SET xp_total = xp_total + $3, last_opened_at = NOW()
        WHERE user_id = $1 AND course_id = $2
      `,
      [userId, lesson.course_id, xpEarned]
    );

    await client.query(
      `
        INSERT INTO leaderboard_entries (
          user_id,
          week_start,
          xp_this_week
        )
        VALUES (
          $1,
          date_trunc('week', CURRENT_DATE)::date,
          $2
        )
        ON CONFLICT (user_id, week_start)
        DO UPDATE SET
          xp_this_week = leaderboard_entries.xp_this_week + EXCLUDED.xp_this_week
      `,
      [userId, xpEarned]
    );

    return {
      xpEarned,
      accuracy,
      correctAnswers,
      totalQuestions,
      streak: newStreak,
      longestStreak: newLongestStreak,
      energy: {
        current: calculatedEnergyEnd,
        max: stats.energy_max
      },
      nextLessonUnlocked: Boolean(nextLesson),
      nextLessonId: nextLesson?.id ?? null
    };
  });

  res.json(result);
}
