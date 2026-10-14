// Package domain defines expense domain types.
package domain

import (
	"time"

	"github.com/google/uuid"
)

type Expense struct {
	ID        uuid.UUID `json:"expense_id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Title     string    `json:"title" db:"title"`
	Amount    int64     `json:"amount" db:"amount"`
	Category  string    `json:"category" db:"category"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
