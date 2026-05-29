package router

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/handler"
	"github.com/Shivraj1712/SpendGrid.git/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func ExpenseRouter(app *fiber.App) {
	h := &handler.ExpenseHandler{}
	expenseGroup := app.Group("/api/v0/expense")
	expenseGroup.Post("/", middleware.Authenticate, h.CreateExpense)
	expenseGroup.Get("/", middleware.Authenticate, h.GetExpenses)
	expenseGroup.Post("/search", middleware.Authenticate, h.SearchAndFilter)
	expenseGroup.Get("/:id", middleware.Authenticate, h.GetAExpense)
	expenseGroup.Put("/:id", middleware.Authenticate, h.UpdateExpense)
	expenseGroup.Delete("/:id", middleware.Authenticate, h.DeleteExpense)
}
