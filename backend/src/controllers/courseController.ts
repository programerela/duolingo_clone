import { Request, Response } from 'express';
import { query, withTransaction } from '../config/db';
import { HttpError } from '../utils/httpError';

export async function listCourses(req: Request, res: Response) {
  const userId = req.user!.id;

  const result = await query<{
    id: string;
    source_language_code: string;
    source_language_name: string;
    target_language_code: string;
    target_language_name: string;
    title: string;
    flag_key: string | null;
    joined: boolean;
    is_user_active: boolean;
    course_xp: number;
  }>(
    `
      SELECT
        c.id,
        c.source_language_code,
        c.source_language_name,
        c.target_language_code,
        c.target_language_name,
        c.title,
        c.flag_key,
        (uc.id IS NOT NULL) AS joined,
        COALESCE(uc.is_active, FALSE) AS is_user_active,
        COALESCE(uc.xp_total, 0) AS course_xp
      FROM courses c
      LEFT JOIN user_courses uc
        ON uc.course_id = c.id
       AND uc.user_id = $1
      WHERE c.is_active = TRUE
      ORDER BY c.title
    `,
    [userId]
  );

  res.json({ courses: result.rows });
}

export async function activateCourse(req: Request, res: Response) {
  const userId = req.user!.id;
  const courseId = req.params.id;

  const courseResult = await query<{ id: string; title: string }>(
    `SELECT id, title FROM courses WHERE id = $1 AND is_active = TRUE`,
    [courseId]
  );

  const course = courseResult.rows[0];

  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE user_courses SET is_active = FALSE WHERE user_id = $1`,
      [userId]
    );

    await client.query(
      `
        INSERT INTO user_courses (user_id, course_id, is_active, last_opened_at)
        VALUES ($1, $2, TRUE, NOW())
        ON CONFLICT (user_id, course_id)
        DO UPDATE SET
          is_active = TRUE,
          last_opened_at = NOW()
      `,
      [userId, courseId]
    );

    const lessonIds = await client.query<{ id: string }>(
      `
        SELECT l.id
        FROM lessons l
        JOIN units u ON u.id = l.unit_id
        JOIN sections s ON s.id = u.section_id
        WHERE s.course_id = $1
        ORDER BY s.sort_order, u.sort_order, l.sort_order
      `,
      [courseId]
    );

    for (let index = 0; index < lessonIds.rows.length; index += 1) {
      const lessonId = lessonIds.rows[index].id;
      const status = index === 0 ? 'AVAILABLE' : 'LOCKED';

      await client.query(
        `
          INSERT INTO user_lesson_progress (user_id, lesson_id, status)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, lesson_id) DO NOTHING
        `,
        [userId, lessonId, status]
      );
    }
  });

  res.json({
    message: 'Course activated',
    course
  });
}

export async function getCoursePath(req: Request, res: Response) {
  const userId = req.user!.id;
  const courseId = req.params.id;

  const courseResult = await query<{
    id: string;
    title: string;
    source_language_name: string;
    target_language_name: string;
    flag_key: string | null;
  }>(
    `
      SELECT id, title, source_language_name, target_language_name, flag_key
      FROM courses
      WHERE id = $1 AND is_active = TRUE
    `,
    [courseId]
  );

  const course = courseResult.rows[0];

  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  const rows = await query<{
    section_id: string;
    section_order: number;
    section_title: string;
    section_subtitle: string | null;
    unit_id: string;
    unit_order: number;
    unit_title: string;
    unit_description: string | null;
    lesson_id: string;
    lesson_order: number;
    lesson_title: string;
    lesson_type: string;
    xp_reward: number;
    status: string;
    completion_count: number;
    best_accuracy: string | null;
  }>(
    `
      SELECT
        s.id AS section_id,
        s.sort_order AS section_order,
        s.title AS section_title,
        s.subtitle AS section_subtitle,
        u.id AS unit_id,
        u.sort_order AS unit_order,
        u.title AS unit_title,
        u.description AS unit_description,
        l.id AS lesson_id,
        l.sort_order AS lesson_order,
        l.title AS lesson_title,
        l.lesson_type,
        l.xp_reward,
        COALESCE(ulp.status, 'LOCKED') AS status,
        COALESCE(ulp.completion_count, 0) AS completion_count,
        ulp.best_accuracy::text
      FROM sections s
      JOIN units u ON u.section_id = s.id
      JOIN lessons l ON l.unit_id = u.id
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id
       AND ulp.user_id = $2
      WHERE s.course_id = $1
      ORDER BY s.sort_order, u.sort_order, l.sort_order
    `,
    [courseId, userId]
  );

  const sections: Array<any> = [];

  for (const row of rows.rows) {
    let section = sections.find((item) => item.id === row.section_id);

    if (!section) {
      section = {
        id: row.section_id,
        sortOrder: row.section_order,
        title: row.section_title,
        subtitle: row.section_subtitle,
        units: []
      };
      sections.push(section);
    }

    let unit = section.units.find((item: any) => item.id === row.unit_id);

    if (!unit) {
      unit = {
        id: row.unit_id,
        sortOrder: row.unit_order,
        title: row.unit_title,
        description: row.unit_description,
        lessons: []
      };
      section.units.push(unit);
    }

    unit.lessons.push({
      id: row.lesson_id,
      sortOrder: row.lesson_order,
      title: row.lesson_title,
      type: row.lesson_type,
      xpReward: row.xp_reward,
      status: row.status,
      completionCount: row.completion_count,
      bestAccuracy: row.best_accuracy === null ? null : Number(row.best_accuracy)
    });
  }

  res.json({
    course: {
      id: course.id,
      title: course.title,
      sourceLanguage: course.source_language_name,
      targetLanguage: course.target_language_name,
      flagKey: course.flag_key
    },
    sections
  });
}
