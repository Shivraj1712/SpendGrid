// Package middleware provides rate limiter middleware.
package middleware

import (
	"log/slog"
	"net/http"

	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func SetupRateLimiter(e *echo.Echo) {
	e.Use(middleware.RateLimiterWithConfig(middleware.RateLimiterConfig{
		Store: middleware.NewRateLimiterMemoryStore(10),
		IdentifierExtractor: func(c *echo.Context) (string, error) {
			return c.RealIP(), nil
		},
		DenyHandler: func(c *echo.Context, identifier string, err error) error {
			slog.Warn("rate limit exceeded",
				"ip", identifier,
				"error", err,
				"path", c.Request().URL.Path,
				"method", c.Request().Method)
			return response.Error(c, http.StatusTooManyRequests, "Too Many Requests at once! Try again later")
		},
	}))
}
