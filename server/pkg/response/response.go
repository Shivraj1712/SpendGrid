// Package response provides HTTP response helpers.
package response

import "github.com/labstack/echo/v5"

type APIResponse struct {
	Message string `json:"message"`
	Status  bool   `json:"status"`
	Data    any    `json:"data"`
}

func Success(c *echo.Context, code int, message string, data any) error {
	return c.JSON(code, &APIResponse{
		Message: message,
		Status:  true,
		Data:    data,
	})
}

func Error(c *echo.Context, code int, message string) error {
	return c.JSON(code, &APIResponse{
		Message: message,
		Status:  false,
		Data:    nil,
	})
}
