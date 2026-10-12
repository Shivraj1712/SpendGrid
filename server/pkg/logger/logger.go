// Package logger provides application logging.
package logger

import (
	"log/slog"
	"os"
)

func LoggerInit() {
	jsonFormatter := slog.NewJSONHandler(os.Stdout, nil)
	slog.SetDefault(slog.New(jsonFormatter))
}
