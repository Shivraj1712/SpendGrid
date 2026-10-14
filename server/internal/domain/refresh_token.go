// Package domain defines refresh token types.
package domain

import (
	"time"

	"github.com/google/uuid"
)

type RefreshToken struct {
	JTI       string    `db:"jti"`
	UserID    uuid.UUID `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}
