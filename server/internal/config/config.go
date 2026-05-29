package config

import (
	"errors"
	"os"

	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/joho/godotenv"
)

type Config struct {
	PORT         string
	DATABASE_URL string
	JWT_SECRET   string
}

var Configuration *Config

func FetchConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		logger.Error("fail to load configs from env", err)
	}
	db_link := os.Getenv("DATABASE_URL")
	if db_link == "" {
		logger.Fatal("No link for database connection", errors.New("Database link is missing"))
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	jwt_secret := os.Getenv("JWT_SECRET")
	if jwt_secret == "" {
		logger.Info("no jwt secret for verification")
	}
	return &Config{
		DATABASE_URL: db_link, PORT: port, JWT_SECRET: jwt_secret,
	}
}
