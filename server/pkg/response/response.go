package response

import "github.com/gofiber/fiber/v2"

type APIResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
	Data    any    `json:"data"`
}

func Response(ctx *fiber.Ctx, message string, data any, success bool, statusCode int) error {
	var response APIResponse
	response.Data = data
	response.Message = message
	response.Success = success
	return ctx.Status(statusCode).JSON(response)
}
