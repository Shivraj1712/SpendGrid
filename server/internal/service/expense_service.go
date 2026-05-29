package service

import (
	"strings"

	"github.com/Shivraj1712/SpendGrid.git/internal/database"
	"github.com/Shivraj1712/SpendGrid.git/internal/domain"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/google/uuid"
)

func CreateExpenseLogic(user_id uuid.UUID, title string, amount float64, category string) (string, error) {
	newExpense := &domain.Expense{
		UserID:   user_id,
		Title:    title,
		Amount:   amount,
		Category: category,
	}
	if err := database.Database.Model(domain.Expense{}).Create(newExpense).Error; err != nil {
		logger.Error("Failed to create any expense", err)
		return "", err
	}
	return "Expense Created Successfully", nil
}

func GetExpensesLogic(user_id uuid.UUID) ([]domain.Expense, error) {
	var expenses []domain.Expense
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ?", user_id).Order("created_at DESC").Find(&expenses).Error; err != nil {
		logger.Error("Failed to fetch expenses", err)
		return nil, err
	}
	return expenses, nil
}
func GetAExpenseLogic(user_id uuid.UUID, expense_id uuid.UUID) (domain.Expense, error) {
	var expense domain.Expense
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ? AND id = ?", user_id, expense_id).First(&expense).Error; err != nil {
		logger.Error("Failed to fetch required expense", err)
		return domain.Expense{}, err
	}
	return expense, nil
}
func UpdateExpenseLogic(user_id uuid.UUID, expense_id uuid.UUID, title string, amount float64, category string) (string, error) {
	var expense domain.Expense
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ? AND id = ?", user_id, expense_id).First(&expense).Error; err != nil {
		logger.Error("No such Expense found", err)
		return "", err
	}
	if strings.TrimSpace(title) != "" {
		expense.Title = strings.TrimSpace(title)
	}
	if strings.TrimSpace(category) != "" {
		expense.Category = strings.TrimSpace(category)
	}
	if amount != expense.Amount {
		expense.Amount = amount
	}
	if err := database.Database.Save(&expense).Error; err != nil {
		logger.Error("Failed to update the expense", err)
		return "", err
	}
	return "Updated the expense successfully", nil
}
func DeleteExpenseLogic(user_id uuid.UUID, expense_id uuid.UUID) (string, error) {
	var expense domain.Expense
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ? AND id = ?", user_id, expense_id).Delete(&expense).Error; err != nil {
		logger.Error("Failed to delete expense", err)
		return "", err
	}
	return "Expense Deleted Successfully", nil
}
func SearchAndFilterLogic(user_id uuid.UUID, searchTerm string, category string) ([]domain.Expense, error) {
	query := database.Database.Model(domain.Expense{}).Where("user_id = ?", user_id)
	if strings.TrimSpace(searchTerm) != "" {
		query = query.Where("title ILike ?", "%"+strings.TrimSpace(searchTerm)+"%")
	}
	if strings.TrimSpace(category) != "" {
		query = query.Where("category = ?", category)
	}
	var expenses []domain.Expense

	if err := query.Find(&expenses).Error; err != nil {
		logger.Error("Failed to search for expenses", err)
		return nil, err
	}
	return expenses, nil
}
