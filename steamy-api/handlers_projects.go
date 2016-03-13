package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/kiasaki/steamy/steamy-api/data"
	"github.com/kiasaki/steamy/steamy-api/util"
)

func V1ProjectsShow(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")

	project, err := data.ProjectsFetchOne(id)
	if err == sql.ErrNoRows {
		SetNotFoundResponse(w)
		WriteEntity(w, J{"error": "Can't find project"})
	} else if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	SetOKResponse(w, J{"data": project})
}

func V1ProjectsIndex(w http.ResponseWriter, r *http.Request) {
	projects, err := data.ProjectsFetchList()
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	SetOKResponse(w, J{"data": projects})
}

func V1ProjectsCreate(w http.ResponseWriter, r *http.Request) {
	var project = &data.Project{}
	err := Bind(r, project)
	if err != nil {
		fmt.Println(err)
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}

	if len(project.Title) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Title is a required field"})
		return
	}

	project.Id = util.NewUUID().String()
	project.Created = time.Now()
	project.Updated = time.Now()

	err = data.ProjectsCreate(project)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving project to database"})
		return
	}

	SetOKResponse(w, J{"data": project})
}

func V1ProjectsUpdate(w http.ResponseWriter, r *http.Request) {
	var id = PathString(r, "id")
	var project = &data.Project{}
	err := Bind(r, project)
	if err != nil {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Error reading request entity"})
		return
	}
	project.Id = id

	if len(project.Title) <= 0 {
		SetBadRequestResponse(w)
		WriteEntity(w, J{"error": "Title is a required field"})
		return
	}

	err = data.ProjectsUpdate(project)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving project to database"})
		return
	}

	SetOKResponse(w, J{"data": project})
}
