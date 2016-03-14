package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/kiasaki/steamy/steamy-api/data"
	"github.com/kiasaki/steamy/steamy-api/util"
)

type GithubPushPayloadAuthor struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

type GithubPushPayloadCommit struct {
	Id        string                  `json:"id"`
	Timestamp time.Time               `json:"timestamp"`
	Author    GithubPushPayloadAuthor `json:"author"`
}

type GithubPushPayloadRepository struct {
	Name     string `json:"name"`
	Fullname string `json:"fullname"`
	CloneURL string `json:"clone_url"`
}

type GithubPushPayload struct {
	Ref        string                      `json:"ref"`
	HeadCommit GithubPushPayloadCommit     `json:"head_commit"`
	Repository GithubPushPayloadRepository `json:"repository"`
}

func V1HooksCommit(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		SetInternalServerErrorResponse(w, err)
		return
	}

	var payload = r.PostFormValue("payload")
	var projectId = r.URL.Query().Get("project_id")

	switch r.Header.Get("X-GitHub-Event") {
	case "ping":
		SetOKResponse(w, J{"message": "Pong!"})
	case "push":
		// Parse json payload
		var ghPayload GithubPushPayload
		err = json.Unmarshal([]byte(payload), &ghPayload)
		if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Can't read request payload"})
			return
		}

		// Fetch project
		project, err := data.ProjectsFetchOne(projectId)
		if err == sql.ErrNoRows {
			SetBadRequestResponse(w)
			WriteEntity(w, J{"error": "Error this project id doesn't exist"})
			return
		} else if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Error retrieving webhook project"})
			return
		}

		// Create build
		var build = &data.Build{
			Id:         util.NewUUID().String(),
			Version:    ghPayload.HeadCommit.Timestamp.Format("20060102-1504") + "-" + ghPayload.HeadCommit.Id[0:7],
			ProjectId:  project.Id,
			Status:     data.BuildStatusWaiting,
			RepoUrl:    ghPayload.Repository.CloneURL,
			RepoName:   ghPayload.Repository.Fullname,
			RepoBranch: ghPayload.Ref[len("refs/heads/"):],
			RepoCommit: ghPayload.HeadCommit.Id,
			Publisher:  ghPayload.HeadCommit.Author.Email,
			Created:    time.Now().UTC(),
		}
		err = data.BuildsCreate(build)
		if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Error saving build to database"})
			return
		}

		SetOKResponse(w, J{"message": "All good, build " + build.Version + " created"})
		return
	default:
		SetNotFoundResponse(w)
	}
}
