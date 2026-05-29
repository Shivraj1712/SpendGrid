package handler

import (
	"time"

	"github.com/Shivraj1712/SpendGrid.git/internal/service"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/Shivraj1712/SpendGrid.git/pkg/validator"
	goValidate "github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)


var validate = goValidate.New()

type AuthHandler struct{}

func (r *AuthHandler) SignUp(ctx *fiber.Ctx) error {
	var request validator.SignUp
	if err := ctx.BodyParser(&request); err != nil {
		logger.Error("Failed to load the data from the user request into server", err)
		return fiber.NewError(fiber.StatusBadRequest, "Failed to load the data from the user request into server")
	}
	if err := validate.Struct(request); err != nil {
		logger.Error("Entered Invalid Credentials", err)
		return fiber.NewError(fiber.StatusBadRequest, "Entered Invalid Credentials")
	}
	token, err := service.SignUpLogic(request.Name, request.Email, request.Password)
	if err != nil {
		if err.Error() == "User already exists" {
			return fiber.NewError(fiber.StatusConflict, "User already exists")
		}
		logger.Error("Failed to generate valid token", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to generate valid token")
	}
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		HTTPOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(time.Hour * 72),
	}
	ctx.Cookie(&cookie)
	return response.Response(ctx, "User Sign Up Successful", nil, true, fiber.StatusCreated)
}

func (r *AuthHandler) Login(ctx *fiber.Ctx) error {
	var request validator.Login
	if err := ctx.BodyParser(&request); err != nil {
		logger.Error("Failed to parse the request body", err)
		return fiber.NewError(fiber.StatusBadRequest, "Failed to parse the request body")
	}
	if err := validate.Struct(request); err != nil {
		logger.Error("Entered Invalid Credentails", err)
		return fiber.NewError(fiber.StatusBadRequest, "Entered Invalid Credentails")
	}
	token, err := service.LoginLogic(request.Email, request.Password)
	if err != nil {
		logger.Error("Failed to Generate Valid token", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to Generate Valid token")
	}
	cookie := &fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		HTTPOnly: true,
		Secure:   false,
	}
	ctx.Cookie(cookie)
	return response.Response(ctx, "User Login Successful", nil, true, fiber.StatusOK)
}

func (r *AuthHandler) Logout(ctx *fiber.Ctx) error {
	ctx.ClearCookie("jwt")
	return response.Response(ctx, "User Logout Successful", nil, true, fiber.StatusOK)
}

func (r *AuthHandler) UserProfile(ctx *fiber.Ctx) error {
	userValue := ctx.Locals("user_id")
	value, ok := userValue.(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to covered user_id into string")
	}
	user_id, err := uuid.Parse(value)
	if err != nil {
		logger.Error("Failed to parse user id into UUID", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse user id into UUID")
	}
	data, err := service.GetProfile(user_id)
	if err != nil {
		logger.Error("Failed to fetch user data", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch user data")
	}
	return response.Response(ctx, "", data, true, fiber.StatusOK)
}
