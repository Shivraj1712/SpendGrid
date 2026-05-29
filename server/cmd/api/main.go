package main

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/config"
	"github.com/Shivraj1712/SpendGrid.git/internal/database"
	"github.com/Shivraj1712/SpendGrid.git/internal/middleware"
	"github.com/Shivraj1712/SpendGrid.git/internal/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.Configuration = config.FetchConfig()
	database.Database = database.ConnectDB()
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
	})
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://localhost:5173 , https://localhost:8000",
		AllowHeaders:     "Origin, Content-type,Accept",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	router.UserRouter(app)
	router.ExpenseRouter(app)
	app.Listen(":" + config.Configuration.PORT)
}
