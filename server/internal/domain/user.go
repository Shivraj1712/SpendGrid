package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"user_id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name      string    `json:"user_name" gorm:"type:varchar(100);not null"`
	Email     string    `json:"email" gorm:"type:text;not null;unique"`
	Password  string    `json:"-" gorm:"type:text;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}
