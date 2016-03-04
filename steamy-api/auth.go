package main

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

func createAuthToken(userId string, hoursOfValidity int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	token.Claims["uid"] = userId
	token.Claims["exp"] = time.Now().Add(time.Hour * time.Duration(hoursOfValidity)).Unix()

	return token.SignedString([]byte(configSecret))
}
