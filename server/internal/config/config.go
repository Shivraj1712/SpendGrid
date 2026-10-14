// Package config defines application configuration.
package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Configuration struct {
	AppEnv      string
	Port        string
	DatabaseURL string
	JWTSecret   string
}

func FetchConfig() (*Configuration, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, errors.New("failed to load the environments!")
	}
	appEnv := getValue("APP_ENV", "development")
	port := getValue("PORT", "8080")
	databaseURL := getValue("DATABASE_URL", "")
	if databaseURL == "" {
		return nil, errors.New("no database link found!")
	}
	jwtSecret := getValue("JWT_SECRET", "")
	if jwtSecret == "" {
		return nil, errors.New("no jwt secret value found!")
	}
	return &Configuration{
		AppEnv:      appEnv,
		Port:        port,
		DatabaseURL: databaseURL,
		JWTSecret:   jwtSecret,
	}, nil
}
func getValue(variable string, fallback string) string {
	value := os.Getenv(variable)
	if value == "" {
		return fallback
	}
	return value
}
