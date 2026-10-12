// Package middleware provides request information middleware.
package middleware

import (
	"log/slog"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func SetupRequestLog(e *echo.Echo) {
	e.Use(middleware.RequestID())
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogHost:      true,
		LogLatency:   true,
		LogRemoteIP:  true,
		LogRequestID: true,
		LogStatus:    true,
		LogURI:       true,
		LogMethod:    true,
		HandleError:  true,
		LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
			slog.Info("Request Info",
				"Host", v.Host,
				"Latency", v.Latency,
				"RemoteIP", v.RemoteIP,
				"RequestID", v.RequestID,
				"Status", v.Status,
				"URI", v.URI,
				"Method", v.Method,
			)
			return nil
		},
	}))
}
