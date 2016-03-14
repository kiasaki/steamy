package main

import (
	"database/sql"
	"net/http"

	"github.com/kiasaki/steamy/steamy-api/data"
	"github.com/kiasaki/steamy/steamy-api/util"
)

func V1EnvironmentsIndex(w http.ResponseWriter, r *http.Request) {
	projectId := PathString(r, "projectId")
	environments, err := data.EnvironmentsFetchListByProject(projectId)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	SetOKResponse(w, J{"data": environments})
}

func V1EnvironmentsShow(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")

	environment, err := data.EnvironmentsFetchOne(id)
	if err == sql.ErrNoRows {
		SetNotFoundResponse(w)
		WriteEntity(w, J{"error": "Can't find environment"})
	} else if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	SetOKResponse(w, J{"data": environment})
}

func validateEnvironment(w http.ResponseWriter, environment *data.Environment, update bool) bool {
	_, err := data.ProjectsFetchOne(environment.ProjectId)
	if err == sql.ErrNoRows {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Project id given doesn't exist"})
		return false
	} else if err != nil {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error finding associated project"})
		return false
	}

	if len(environment.Title) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Title is a required field"})
		return false
	}

	if len(environment.Priority) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Priority is a required field"})
		return false
	}

	if len(environment.Hosts) <= 0 && len(environment.Groups) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "You need to specify at least one group or host"})
		return false
	}

	return true
}

func V1EnvironmentsCreate(w http.ResponseWriter, r *http.Request) {
	var environment = &data.Environment{}
	err := Bind(r, environment)
	if err != nil {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}
	environment.ProjectId = PathString(r, "projectId")

	if !validateEnvironment(w, environment, false) {
		return
	}

	environment.Id = util.NewUUID().String()

	err = data.EnvironmentsCreate(environment)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving environment to database"})
		return
	}

	SetOKResponse(w, J{"data": environment})
}

func V1EnvironmentsUpdate(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")
	var environment = &data.Environment{}
	err := Bind(r, environment)
	if err != nil {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}
	environment.Id = id

	if !validateEnvironment(w, environment, true) {
		return
	}

	err = data.EnvironmentsUpdate(environment)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving update to database"})
		return
	}

	SetOKResponse(w, J{"data": environment})
}
