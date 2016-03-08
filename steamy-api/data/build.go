package data

import (
	"strings"
	"time"
)

type Build struct {
	Id         string    `json:"id" db:"id"`
	Version    string    `json:"version" db:"version"`
	ProjectId  string    `json:"project_id" db:"project_id"`
	RepoUrl    string    `json:"repo_url" db:"repo_url"`
	RepoName   string    `json:"repo_name" db:"repo_name"`
	RepoBranch string    `json:"repo_branch" db:"repo_branch"`
	RepoCommit string    `json:"repo_commit" db:"repo_commit"`
	Publisher  string    `json:"publisher" db:"publisher"`
	Created    time.Time `json:"created" db:"created"`
}

type Builds []Build

var buildsColumns = []string{
	"id", "version", "project_id", "repo_url", "repo_name", "repo_branch", "repo_commit", "publisher", "created",
}

func BuildsCreate(entity *Build) error {
	var query = "INSERT INTO builds (" + strings.Join(buildsColumns, ",") + ") VALUES (:" + strings.Join(buildsColumns, ",:") + ")"
	_, err := DbGet().NamedExec(query, entity)
	return err
}
