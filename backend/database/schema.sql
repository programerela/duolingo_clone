BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    password_hash TEXT NOT NULL,
    timezone VARCHAR(100) NOT NULL DEFAULT 'Europe/Belgrade',
    avatar_key VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_not_empty CHECK (char_length(trim(email)) > 0),
    CONSTRAINT users_username_length CHECK (char_length(username) BETWEEN 3 AND 50)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE UNIQUE INDEX idx_users_email_ci_unique ON users(LOWER(email));
CREATE UNIQUE INDEX idx_users_username_ci_unique ON users(LOWER(username));

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    xp_total INTEGER NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
    streak_count INTEGER NOT NULL DEFAULT 0 CHECK (streak_count >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_activity_date DATE,
    gems_balance INTEGER NOT NULL DEFAULT 0 CHECK (gems_balance >= 0),
    energy_current INTEGER NOT NULL DEFAULT 25,
    energy_max INTEGER NOT NULL DEFAULT 25,
    energy_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lessons_completed INTEGER NOT NULL DEFAULT 0 CHECK (lessons_completed >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_stats_energy_valid CHECK (
        energy_current >= 0 AND energy_max > 0 AND energy_current <= energy_max
    )
);

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_language_code VARCHAR(10) NOT NULL,
    source_language_name VARCHAR(100) NOT NULL,
    target_language_code VARCHAR(10) NOT NULL,
    target_language_name VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    flag_key VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_language_code, target_language_code),
    CHECK (source_language_code <> target_language_code)
);

CREATE INDEX idx_courses_target_language ON courses(target_language_code);

CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    xp_total INTEGER NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, course_id)
);

CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses(course_id);
CREATE UNIQUE INDEX idx_user_courses_one_active_course
    ON user_courses(user_id)
    WHERE is_active = TRUE;

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL CHECK (sort_order > 0),
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, sort_order)
);

CREATE INDEX idx_sections_course_id ON sections(course_id);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL CHECK (sort_order > 0),
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (section_id, sort_order)
);

CREATE INDEX idx_units_section_id ON units(section_id);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL CHECK (sort_order > 0),
    title VARCHAR(150) NOT NULL,
    lesson_type VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    xp_reward INTEGER NOT NULL DEFAULT 10 CHECK (xp_reward >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lessons_type_valid CHECK (
        lesson_type IN ('NORMAL', 'PRACTICE', 'REVIEW', 'CHEST')
    ),
    UNIQUE (unit_id, sort_order)
);

CREATE INDEX idx_lessons_unit_id ON lessons(unit_id);

CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL CHECK (sort_order > 0),
    type VARCHAR(40) NOT NULL,
    instruction VARCHAR(255),
    prompt TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT exercises_type_valid CHECK (
        type IN (
            'MULTIPLE_CHOICE',
            'TYPE_ANSWER',
            'WORD_BANK',
            'MATCH_PAIRS',
            'LISTENING',
            'SELECT_IMAGE'
        )
    ),
    UNIQUE (lesson_id, sort_order)
);

CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX idx_exercises_type ON exercises(type);

CREATE TABLE user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'LOCKED',
    completion_count INTEGER NOT NULL DEFAULT 0 CHECK (completion_count >= 0),
    best_accuracy NUMERIC(5,2),
    best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0),
    first_completed_at TIMESTAMPTZ,
    last_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id),
    CONSTRAINT user_lesson_progress_status_valid CHECK (
        status IN ('LOCKED', 'AVAILABLE', 'COMPLETED')
    ),
    CONSTRAINT user_lesson_progress_accuracy_valid CHECK (
        best_accuracy IS NULL OR (best_accuracy >= 0 AND best_accuracy <= 100)
    )
);

CREATE INDEX idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_lesson_progress_status ON user_lesson_progress(user_id, status);

CREATE TABLE lesson_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL CHECK (total_questions > 0),
    correct_answers INTEGER NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
    xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
    energy_start INTEGER NOT NULL CHECK (energy_start >= 0),
    energy_end INTEGER NOT NULL CHECK (energy_end >= 0),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT lesson_attempts_correct_answers_valid CHECK (
        correct_answers >= 0 AND correct_answers <= total_questions
    )
);

CREATE INDEX idx_lesson_attempts_user_id ON lesson_attempts(user_id);
CREATE INDEX idx_lesson_attempts_lesson_id ON lesson_attempts(lesson_id);
CREATE INDEX idx_lesson_attempts_completed_at ON lesson_attempts(completed_at);

CREATE TABLE streak_freezes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    used_on_date DATE
);

CREATE INDEX idx_streak_freezes_user_id ON streak_freezes(user_id);
CREATE INDEX idx_streak_freezes_unused
    ON streak_freezes(user_id)
    WHERE used_on_date IS NULL;

CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    xp_this_week INTEGER NOT NULL DEFAULT 0 CHECK (xp_this_week >= 0),
    league VARCHAR(30) NOT NULL DEFAULT 'BRONZE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, week_start),
    CONSTRAINT leaderboard_entries_league_valid CHECK (
        league IN (
            'BRONZE', 'SILVER', 'GOLD', 'SAPPHIRE', 'RUBY',
            'EMERALD', 'AMETHYST', 'PEARL', 'OBSIDIAN', 'DIAMOND'
        )
    )
);

CREATE INDEX idx_leaderboard_week ON leaderboard_entries(week_start);
CREATE INDEX idx_leaderboard_week_xp ON leaderboard_entries(week_start, xp_this_week DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_stats_updated_at
BEFORE UPDATE ON user_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_lesson_progress_updated_at
BEFORE UPDATE ON user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_leaderboard_entries_updated_at
BEFORE UPDATE ON leaderboard_entries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
