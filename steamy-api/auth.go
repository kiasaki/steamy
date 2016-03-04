package main

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/kiasaki/steamy/steamy-api/data"
)

func createAuthToken(userId string, hoursOfValidity int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	token.Claims["uid"] = userId
	token.Claims["exp"] = time.Now().Add(time.Hour * time.Duration(hoursOfValidity)).Unix()

	return token.SignedString([]byte(configSecret))
}

func currentUser(r *http.Request) (*data.User, error) {
	vars := mux.Vars(r)
	userId := vars["currentUserId"]
	return data.UsersFetchOne(userId)
}
