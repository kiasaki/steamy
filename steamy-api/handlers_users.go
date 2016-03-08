package main

import (
	"net/http"

	"github.com/kiasaki/steamy/steamy-api/data"
)

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
