package data

import "time"

type Build struct {
	Id         string    `json:"id"`
	Version    string    `json:"version"`
	ProjectId  string    `json:"project_id"`
	RepoUrl    string    `json:"repo_url"`
	RepoName   string    `json:"repo_name"`
	RepoBranch string    `json:"repo_branch"`
	RepoCommit string    `json:"repo_commit"`
	Publisher  string    `json:"publisher"`
	Created    time.Time `json:"created"`
}

type Builds []Build

const buildsSqlParams = "id, version, project_id, repo_url, repo_name, repo_branch, repo_commit, publisher, created"

func DbBuildsCreate(b *Build) error {
	var query = `INSERT INTO builds (` + buildsSqlParams + `) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	_, err := DbExec(
		query, b.Id, b.Version, b.ProjectId, b.RepoUrl, b.RepoName,
		b.RepoBranch, b.RepoCommit, b.Publisher, b.Created,
	)
	return err
}
