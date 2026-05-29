package middleware

import (
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(ctx *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"
	if err, ok := err.(*fiber.Error); ok {
		code = err.Code
		message = err.Message
	}
	logger.Error(message, err)
	return response.Response(ctx, message, nil, false, code)
}
