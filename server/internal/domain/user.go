// Package domain defines user domain types.
package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `json:"user_id" db:"id"`
	Name         string    `json:"user_name" db:"name"`
	Email        string    `json:"user_email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	AvatarURL    string    `json:"avatar_url" db:"-"`
	AvatarKey    string    `json:"-" db:"avatar_key"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}
