// Package utils provides password utilities.
package utils

import (
	"golang.org/x/crypto/bcrypt"
)

const bcryptCost int = 12

func GenerateHashPassword(password string) (string, error) {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return "", err
	}
	return string(hashPassword), nil
}

func VerifyPassword(enteredPassword string, userPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(enteredPassword))
}
