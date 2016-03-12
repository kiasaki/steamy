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

	user.Password = ""
	SetOKResponse(w, J{"data": user})
}

func V1UsersIndex(w http.ResponseWriter, r *http.Request) {
	fetchedUsers, err := data.UsersFetchList()
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}
	users := *fetchedUsers

	for i := range users {
		users[i].Password = ""
	}
	SetOKResponse(w, J{"data": users})
}

func validateUser(w http.ResponseWriter, user *data.User, isUpdate bool) bool {
	if len(user.Email) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Email is a required field"})
		return false
	}
	if len(user.Password) < 8 {
		if isUpdate && len(user.Password) == 0 {
			return true
		}
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "A password of minimum 8 characters is required"})
		return false
	}

	return true
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

	valid := validateUser(w, user, false)
	if !valid {
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

	user.Password = ""
	SetOKResponse(w, J{"data": user})
}

func V1UsersUpdate(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")
	var user = &data.User{}
	err := Bind(r, user)
	if err != nil {
		fmt.Println(err)
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}
	user.Id = id

	valid := validateUser(w, user, true)
	if !valid {
		return
	}

	// Update password if non-empty
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), BCRYPT_COST)
		if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Error saving user"})
			return
		}
		user.Password = string(hashedPassword)
	}

	err = data.UsersUpdate(user)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving user to database"})
		return
	}

	user.Password = ""
	SetOKResponse(w, J{"data": user})
}
