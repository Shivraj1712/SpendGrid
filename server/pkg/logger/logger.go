package logger

import (
	"log"
	"os"
)

func Info(message string) {
	log.Printf("Info : %s", message)
}

func Error(message string, err error) {
	log.Printf("Error : %s | Details : %+v", message, err)
}

func Fatal(message string, err error) {
	log.Printf("Error : %s | Details : %+v", message, err)
	os.Exit(1)
}
