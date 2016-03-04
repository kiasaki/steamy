package data

type Environment struct {
	Id        string   `json:"id"`
	Title     string   `json:"title"`
	Hosts     []string `json:"hosts"`
	Groups    []string `json:"groups"`
	ProjectId string   `json:"project_id"`
}

type Environments []Environment

var EnvironmentNotFound = &Environment{}
