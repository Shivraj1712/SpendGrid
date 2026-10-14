// Package main is the entrypoint for the SpendGrid API.
package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Shivraj1712/SpendGrid.git/internal/config"
	"github.com/Shivraj1712/SpendGrid.git/internal/database"
	"github.com/Shivraj1712/SpendGrid.git/internal/server"
	"github.com/Shivraj1712/SpendGrid.git/pkg/logger"
	"github.com/labstack/echo/v5"
)

func main() {
	logger.LoggerInit()
	cfgs, err := config.FetchConfig()
	if err != nil {
		slog.Error("failed to load setup environments",
			"error", err)
		os.Exit(1)
	}
	bootCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	db, err := database.ConnectDB(bootCtx, cfgs.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to the database",
			"error", err)
		os.Exit(1)
	}
	defer db.Close()
	srv := server.New(db)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	startConfig := echo.StartConfig{
		Address:         ":" + cfgs.Port,
		GracefulTimeout: 20 * time.Second,
	}
	err = startConfig.Start(ctx, srv)
	if err != nil {
		slog.Error("failed to start the server",
			"error", err)
		os.Exit(1)
	}
}
