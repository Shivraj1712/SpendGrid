package utils

import (
	"time"

	"github.com/Shivraj1712/SpendGrid.git/internal/config"
	"github.com/golang-jwt/jwt"
)

func GenerateToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secertKey := []byte(config.Configuration.JWT_SECRET)
	return token.SignedString(secertKey)
}

func ParseToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.Configuration.JWT_SECRET), nil
	})
	if err != nil || !token.Valid {
		return "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if userID, exists := claims["user_id"].(string); exists {
			return userID, nil
		}
	}
	return "", err
}
