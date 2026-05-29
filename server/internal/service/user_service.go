package service

import (
	"errors"

	"github.com/Shivraj1712/SpendGrid.git/internal/database"
	"github.com/Shivraj1712/SpendGrid.git/internal/domain"
	"github.com/Shivraj1712/SpendGrid.git/internal/utils"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func SignUpLogic(name string, email string, password string) (string, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		logger.Error("Failed to generated hashed version of password", err)
		return "", err
	}
	var userExists domain.User
	err = database.Database.Model(domain.User{}).Where("email = ?", email).First(&userExists).Error
	if err == nil {
		logger.Error("User already exists", errors.New("User already exists"))
		return "", errors.New("User already exists")
	}
	user := domain.User{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
	}
	err = database.Database.Model(domain.User{}).Create(&user).Error
	if err != nil {
		logger.Error("failed to signup", err)
		return "", err
	}
	token, err := utils.GenerateToken(user.ID.String())
	if err != nil {
		logger.Error("Failed to generate Token", err)
		return "", err
	}
	return token, nil
}

func LoginLogic(email string, password string) (string, error) {
	var user domain.User
	err := database.Database.Model(domain.User{}).Where("email = ?", email).First(&user).Error
	if err != nil {
		logger.Error("User not found", err)
		return "", err
	}
	err = utils.VerifyPassword(password, user.Password)
	if err != nil {
		logger.Error("Invalid credentails", err)
		return "", err
	}
	token, err := utils.GenerateToken(user.ID.String())
	if err != nil {
		logger.Error("Failed to generate token", err)
		return "", err
	}
	return token, nil
}

func GetProfile(user_id uuid.UUID) (any, error) {
	var user domain.User
	var totalExpenses int64
	var totalAmount float64
	if err := database.Database.Model(domain.User{}).Where("id = ?", user_id).First(&user).Error; err != nil {
		logger.Error("User not found", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "User not found")
	}
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ?", user_id).Count(&totalExpenses).Error; err != nil {
		logger.Error("Failed to fetch user data", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch user data")
	}
	if err := database.Database.Model(domain.Expense{}).Where("user_id = ?", user_id).Select("COALESCE(SUM(amount),0)").Scan(&totalAmount).Error; err != nil {
		logger.Error("Failed to fetch user data", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch user data")
	}
	return fiber.Map{
		"user_name":      user.Name,
		"email":          user.Email,
		"total_expenses": totalExpenses,
		"total_amount":   totalAmount,
	}, nil
}
