package middleware

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/utils"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/gofiber/fiber/v2"
)

func Authenticate(ctx *fiber.Ctx) error {
	tokenString := ctx.Cookies("jwt")
	if tokenString == "" {
		return response.Response(ctx, "Not authorized", nil, false, fiber.StatusUnauthorized)
	}
	UserID, err := utils.ParseToken(tokenString)
	if err != nil {
		logger.Error("Not authorized", err)
		return response.Response(ctx, "Not authorized", nil, false, fiber.StatusUnauthorized)
	}
	ctx.Locals("user_id", UserID)
	return ctx.Next()
}
