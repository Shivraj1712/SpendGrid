package router

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/handler"
	"github.com/Shivraj1712/SpendGrid.git/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func UserRouter(app *fiber.App) {
	h := &handler.AuthHandler{}
	authGroup := app.Group("/api/v0/auth")
	authGroup.Post("/signup", h.SignUp)
	authGroup.Post("/login", h.Login)
	authGroup.Post("/logout", h.Logout)
	authGroup.Get("/profile", middleware.Authenticate, h.UserProfile)
}
