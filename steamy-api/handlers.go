package main

import (
	"io"
	"net/http"
	"os"
	"time"
)

func ApiIndex(w http.ResponseWriter, r *http.Request) {
	SetOKResponse(w, J{
		"data": J{
			"version": "v1",
			"motd":    "Steamy API V1",
		},
	})
}

func BuildsIndex(w http.ResponseWriter, r *http.Request) {
	SetOKResponse(w, J{})
}

func BuildsShowArtifact(w http.ResponseWriter, r *http.Request) {
	var buildId = PathString(r, "buildId")
	var buildArtifactPath = buildArtifactPath(buildId)

	if _, err := os.Stat(buildArtifactPath); os.IsNotExist(err) {
		SetNotFoundResponse(w)
	} else if err != nil {
		SetInternalServerErrorResponse(w, err)
	} else {
		http.ServeFile(w, r, buildArtifactPath)
	}
}

func BuildsCreate(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	project, err := ProjectsFetchOneByName(r.PostFormValue("project"))
	if err != nil {
		SetInternalServerErrorResponse(w, err)
	} else if project == ProjectNotFound {
		SetNotFoundResponse(w)
		WriteEntity(w, J{"error": "Project not found"})
	}

	// Get file from request
	file, _, err := r.FormFile("artifact")
	if err != nil {
		SetBadRequestResponse(w)
		return
	}
	defer file.Close()

	// Decide on new build id
	var buildId = NewUUID().String()

	// Save artifact to disk
	var newFilePath = buildArtifactPath(buildId)
	newFile, err := os.OpenFile(newFilePath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving build to disk"})
		return
	}
	defer newFile.Close()

	io.Copy(newFile, file)

	// Create build
	var build = &Build{
		Id:         buildId,
		Version:    r.PostFormValue("version"),
		ProjectId:  project.Id,
		RepoUrl:    r.PostFormValue("repo_url"),
		RepoName:   r.PostFormValue("repo_name"),
		RepoBranch: r.PostFormValue("repo_branch"),
		RepoCommit: r.PostFormValue("repo_commit"),
		Publisher:  r.PostFormValue("publisher"),
		Created:    time.Now(),
	}
	err = DbBuildsCreate(build)
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		WriteEntity(w, J{"error": "Error saving build to database"})
		return
	}

	SetNoContentResponse(w)
}
