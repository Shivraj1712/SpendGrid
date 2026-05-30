package main

import (
	"github.com/Shivraj1712/SpendGrid.git/internal/config"
	"github.com/Shivraj1712/SpendGrid.git/internal/database"
	"github.com/Shivraj1712/SpendGrid.git/internal/middleware"
	"github.com/Shivraj1712/SpendGrid.git/internal/router"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.Configuration = config.FetchConfig()
	database.Database = database.ConnectDB()
	app := fiber.New(fiber.Config{
		ErrorHandler:   middleware.ErrorHandler,
		ReadBufferSize: 16384, // 16KB to prevent 431 Request Header Fields Too Large from local cookie accumulation
	})
	logger.Info("Server is started running")
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://spend-grid-lovat.vercel.app/,http://localhost:3000, http://localhost:3001, http://127.0.0.1:3000, http://127.0.0.1:3001, http://localhost:5173, http://127.0.0.1:5173, https://localhost:5173, https://localhost:8000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	router.UserRouter(app)
	router.ExpenseRouter(app)
	app.Listen(":" + config.Configuration.PORT)
}
