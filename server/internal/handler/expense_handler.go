package handler

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/service"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/Shivraj1712/SpendGrid.git/pkg/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)


type ExpenseHandler struct{}

func (r *ExpenseHandler) CreateExpense(ctx *fiber.Ctx) error {
	var request validator.CreateExpense
	if err := ctx.BodyParser(&request); err != nil {
		logger.Error("Failed to Parse Request body for creating expense", err)
		return fiber.NewError(fiber.StatusBadRequest, "Failed to Parse Request body for creating expense")
	}
	if err := validate.Struct(request); err != nil {
		logger.Error("Enter validate data for creating new expense", err)
		return fiber.NewError(fiber.StatusBadRequest, "Enter validate data for creating new expense")
	}
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	amount := request.Amount
	category := request.Category
	title := request.Title
	res, err := service.CreateExpenseLogic(user_id, title, amount, category)
	if err != nil {
		return response.Response(ctx, "Failed to create expense", nil, false, fiber.StatusInternalServerError)
	}
	return response.Response(ctx, res, nil, true, fiber.StatusCreated)
}
func (r *ExpenseHandler) GetExpenses(ctx *fiber.Ctx) error {
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	expenses, err := service.GetExpensesLogic(user_id)
	return response.Response(ctx, "", expenses, true, fiber.StatusOK)
}
func (r *ExpenseHandler) GetAExpense(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	expense_id, err := uuid.Parse(id)
	if err != nil {
		logger.Error("Failed to parse expense id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse expense id into UUID")
	}
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	expense, err := service.GetAExpenseLogic(user_id, expense_id)
	if err != nil {
		return response.Response(ctx, "No such expense found", nil, false, fiber.StatusNotFound)
	}
	return response.Response(ctx, "", expense, true, fiber.StatusOK)
}
func (r *ExpenseHandler) UpdateExpense(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	expense_id, err := uuid.Parse(id)
	if err != nil {
		logger.Error("Failed to parse the expense id", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse the expense id")
	}
	var request validator.UpdateExpense
	if err := ctx.BodyParser(&request); err != nil {
		logger.Error("Failed to Parse Request body for updating expense", err)
		return fiber.NewError(fiber.StatusBadRequest, "Failed to Parse Request body for updating expense")
	}
	if err := validate.Struct(request); err != nil {
		logger.Error("Enter validate data for updating a expense", err)
		return fiber.NewError(fiber.StatusBadRequest, "Enter validate data for updating a expense")
	}
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	updated, err := service.UpdateExpenseLogic(user_id, expense_id, request.Title, request.Amount, request.Category)
	if err != nil {
		logger.Error("Failed to update the expense", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to update the expense")
	}
	return response.Response(ctx, updated, nil, true, fiber.StatusOK)
}
func (r *ExpenseHandler) DeleteExpense(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	expense_id, err := uuid.Parse(id)
	if err != nil {
		logger.Error("Failed to parse the expense id", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse the expense id")
	}
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	result, err := service.DeleteExpenseLogic(user_id, expense_id)
	if err != nil {
		logger.Error("Failed to delete expense", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete expense")
	}
	return response.Response(ctx, result, nil, true, fiber.StatusOK)
}
func (r *ExpenseHandler) SearchAndFilter(ctx *fiber.Ctx) error {
	searchTerm := ctx.Query("searchTerm")
	category := ctx.Query("category")
	userValue := ctx.Locals("user_id")
	user_id, err := uuid.Parse(userValue.(string))
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	result, err := service.SearchAndFilterLogic(user_id, searchTerm, category)
	if err != nil {
		logger.Error("Unwanted error occurred", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Unwanted error occurred")
	}
	return response.Response(ctx, "", result, true, fiber.StatusOK)
}
