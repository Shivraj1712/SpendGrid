// Package utils provides token utilities.
package utils

import (
	"time"

	"github.com/Shivraj1712/SpendGrid.git/internal/domain"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

type TokenInterface interface {
	GenerateAccessToken(userID uuid.UUID) (string, error)
	VerifyAccessToken(tokenStr string) (jwt.MapClaims, error)
	GenerateRefreshToken(userID uuid.UUID) (string, string, error)
	VerifyRefreshToken(tokenStr string) (jwt.MapClaims, error)
}

type TokenHandler struct {
	JwtSecret   string
	AccessTime  time.Duration
	RefreshTime time.Duration
}

func NewTokenHandler(jwtSecret string, accessTime time.Duration, refreshTime time.Duration) TokenInterface {
	return &TokenHandler{
		JwtSecret:   jwtSecret,
		AccessTime:  accessTime,
		RefreshTime: refreshTime,
	}
}

func (r *TokenHandler) GenerateAccessToken(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"sub":  userID.String(),
		"type": "access",
		"iat":  time.Now().Unix(),
		"exp":  time.Now().Add(r.AccessTime).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(r.JwtSecret))
}

func (r *TokenHandler) GenerateRefreshToken(userID uuid.UUID) (string, string, error) {
	jti := uuid.New().String()
	claims := jwt.MapClaims{
		"sub":  userID.String(),
		"jti":  jti,
		"type": "refresh",
		"iat":  time.Now().Unix(),
		"exp":  time.Now().Add(r.RefreshTime).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(r.JwtSecret))
	if err != nil {
		return "", "", echo.ErrInternalServerError
	}
	return signed, jti, nil
}
func (r *TokenHandler) VerifyAccessToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, domain.ErrUnauthorized
		}
		return []byte(r.JwtSecret), nil
	})
	if err != nil {
		return nil, domain.ErrUnauthorized
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, domain.ErrUnauthorized
	}
	if claims["type"] != "access" {
		return nil, domain.ErrUnauthorized
	}
	return claims, nil
}
func (r *TokenHandler) VerifyRefreshToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, domain.ErrUnauthorized
		}
		return []byte(r.JwtSecret), nil
	})
	if err != nil {
		return nil, domain.ErrUnauthorized
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, domain.ErrUnauthorized
	}
	if claims["type"] != "refresh" {
		return nil, domain.ErrUnauthorized
	}
	return claims, nil
}
