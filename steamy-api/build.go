package main

import "time"

type Build struct {
	Id          string
	Name        string
	Version     string
	ArtifactUrl string
	RepoUrl     string
	RepoName    string
	RepoBranch  string
	Publisher   string
	Created     time.Time
	Updated     time.Time
}

type Builds []Build
