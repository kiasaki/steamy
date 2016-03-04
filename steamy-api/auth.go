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
	token := jwt.New(jwt.SigningMethodHS256)

	token.Claims["uid"] = userId
	token.Claims["exp"] = time.Now().Add(time.Hour * time.Duration(hoursOfValidity)).Unix()

	return token.SignedString([]byte(configSecret))
}

func currentUser(r *http.Request) (*data.User, error) {
	user, ok := context.Get(r, "currentUser").(*data.User)
	if !ok {
		return user, errors.New("No current user for request")
	}
	return user, nil
}
