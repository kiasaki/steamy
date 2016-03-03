package main

import "time"

type Build struct {
	Id         string
	Version    string
	ProjectId  string
	RepoUrl    string
	RepoName   string
	RepoBranch string
	RepoCommit string
	Publisher  string
	Created    time.Time
}

type Builds []Build

func buildArtifactPath(buildId string) string {
	return configBuildsDir + "/" + buildId + ".tar.gz"
}

const buildsSqlParams = "id, version, project_id, repo_url, repo_name, repo_branch, repo_commit, publisher, created"

func DbBuildsCreate(b *Build) error {
	var query = `INSERT INTO builds (` + buildsSqlParams + `) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	_, err := DbExec(
		query, b.Id, b.Version, b.ProjectId, b.RepoUrl, b.RepoName,
		b.RepoBranch, b.RepoCommit, b.Publisher, b.Created,
	)
	return err
}
