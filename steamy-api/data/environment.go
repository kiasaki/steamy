package data

type Environment struct {
	Id        string   `json:"id" db:"id"`
	Title     string   `json:"title" db:"title"`
	Hosts     []string `json:"hosts" db:"hosts"`
	Groups    []string `json:"groups" db:"groups"`
	ProjectId string   `json:"project_id" db:"project_id"`
}

type Environments []Environment

var EnvironmentNotFound = &Environment{}
