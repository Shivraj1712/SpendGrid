// Package middleware provides error handling middleware.
package middleware

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

func ErrorHandler(c *echo.Context, err error) {
	code := http.StatusInternalServerError
	message := "Internal Server Error"
	if currErr, check := err.(*echo.HTTPError); check {
		code = currErr.Code
		message = currErr.Message
	}
	c.JSON(code, message)
}
