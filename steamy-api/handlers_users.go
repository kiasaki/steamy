package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/kiasaki/steamy/steamy-api/data"
	"github.com/kiasaki/steamy/steamy-api/util"
	"golang.org/x/crypto/bcrypt"
)

const BCRYPT_COST = 12

func V1UsersShow(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")

	user, err := data.UsersFetchOne(id)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}
	if user == data.UserNotFound {
		SetNotFoundResponse(w)
		WriteEntity(w, J{"error": "Can't find user"})
	}

	SetOKResponse(w, J{"data": user})
}

func V1UsersIndex(w http.ResponseWriter, r *http.Request) {
	users, err := data.UsersFetchList()
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	SetOKResponse(w, J{"data": users})
}

func V1UsersCreate(w http.ResponseWriter, r *http.Request) {
	var user = &data.User{}
	err := Bind(r, user)
	if err != nil {
		fmt.Println(err)
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}

	if len(user.Email) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Email is a required field"})
		return
	}
	if len(user.Password) < 8 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "A password of minimum 8 characters is required"})
		return
	}

	user.Id = util.NewUUID().String()
	user.Deleted = false
	user.Created = time.Now()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), BCRYPT_COST)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving user"})
		return
	}
	user.Password = string(hashedPassword)

	err = data.UsersCreate(user)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving user to database"})
		return
	}

	SetOKResponse(w, J{"data": user})
}
