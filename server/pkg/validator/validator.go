package validator


type SignUp struct {
	Name     string `json:"user_name" validate:"required,min=5"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type Login struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type CreateExpense struct {
	Title    string    `json:"title" validate:"required,min=3"`
	Amount   float64   `json:"amount" validate:"required,gt=0"`
	Category string    `json:"category" validate:"required,min=3"`
}

type UpdateExpense struct {
	Title     string    `json:"title" validate:"required,min=3"`
	Amount    float64   `json:"amount" validate:"required,gt=0"`
	Category  string    `json:"category" validate:"required,min=3"`
}
