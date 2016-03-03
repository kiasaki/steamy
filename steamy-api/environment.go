package main

type Environment struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	ProjectId string `json:"project_id"`
}

type Environments []Environment

var EnvironmentNotFound = &Environment{}
