BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_ci_unique
    ON users(LOWER(email));

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_ci_unique
    ON users(LOWER(username));

COMMIT;
