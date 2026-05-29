package domain

import (
	"time"

	"github.com/google/uuid"
)

type Expense struct {
	ID        uuid.UUID `json:"expense_id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	Title     string    `json:"title" gorm:"type:text;not null"`
	Amount    float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
	Category  string    `json:"category" gorm:"type:text;not null;default:normal"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
