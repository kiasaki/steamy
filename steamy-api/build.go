package main

import "time"

type Build struct {
	Id          string
	Version     string
	ArtifactUrl string
	ProjectId   string
	RepoUrl     string
	RepoName    string
	RepoBranch  string
	RepoCommit  string
	Publisher   string
	Created     time.Time
}

type Builds []Build
