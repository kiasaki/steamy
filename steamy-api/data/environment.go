package data

type Environment struct {
	Id           string   `json:"id" db:"id"`
	ProjectId    string   `json:"project_id" db:"project_id"`
	Title        string   `json:"title" db:"title"`
	Priority     string   `json:"priority" db:"priority"`
	ScriptEnv    string   `json:"script_env" db:"script_env"`
	ScriptDeploy string   `json:"script_deploy" db:"script_deploy"`
	Hosts        []string `json:"hosts" db:"hosts"`
	Groups       []string `json:"groups" db:"groups"`
}

type Environments []Environment

var EnvironmentNotFound = &Environment{}
