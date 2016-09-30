package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"github.com/kiasaki/steamy/steamy-api/data"
)

func createAuthToken(userId string, hoursOfValidity int) (string, error) {
	claims := jwt.MapClaims{}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	claims["uid"] = userId
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(hoursOfValidity)).Unix()

	return token.SignedString([]byte(configSecret))
}

func currentUser(r *http.Request) (*data.User, error) {
	user, ok := context.Get(r, "currentUser").(*data.User)
	if !ok {
		return user, errors.New("No current user for request")
	}
	return user, nil
}
