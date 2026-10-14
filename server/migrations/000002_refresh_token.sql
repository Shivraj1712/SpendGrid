-- +goose Up
CREATE TABLE "refresh_tokens" (
    jti TEXT NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
);
-- +goose Down
DROP TABLE IF EXISTS "refresh_tokens";
