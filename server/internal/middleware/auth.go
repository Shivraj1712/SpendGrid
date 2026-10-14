// Package middleware provides authentication middleware.
package middleware

import (
	"net/http"

	"github.com/Shivraj1712/SpendGrid.git/internal/domain"
	"github.com/Shivraj1712/SpendGrid.git/internal/utils"
	"github.com/Shivraj1712/SpendGrid.git/pkg/response"
	"github.com/labstack/echo/v5"
)

func Authenticate(tokenInterface utils.TokenInterface) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			token, err := c.Cookie("spendGridToken")
			if err != nil {
				return response.Error(c, http.StatusUnauthorized, domain.ErrUnauthorized.Error())
			}
			claims, err := tokenInterface.VerifyAccessToken(token.Value)
			if err != nil {
				return response.Error(c, http.StatusUnauthorized, domain.ErrUnauthorized.Error())
			}
			c.Set("user_id", claims["sub"])
			return next(c)
		}
	}
}
