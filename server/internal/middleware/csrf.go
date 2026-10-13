// Package middleware provides csrf middleware.
package middleware

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func SetUpCSRF(e *echo.Echo) {
	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLength:    32,
		TokenLookup:    "header:X-CSRF-Token",
		TrustedOrigins: []string{"http://localhost:3000"},
		CookieSecure:   false,
		CookiePath:     "/",
		CookieName:     "csrf_token",
		ContextKey:     "csrf",
		CookieHTTPOnly: false,
		CookieMaxAge:   72 * 60 * 60,
		CookieSameSite: http.SameSiteLaxMode,
	}))
}
