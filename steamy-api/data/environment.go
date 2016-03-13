package data

import "strings"

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

var environmentsColumns = []string{
	"id", "project_id", "title", "priority", "script_env", "script_deploy",
	"hosts", "groups",
}

func EnvironmentsFetchListByProject(projectId string) (*Environments, error) {
	var entities = Environments{}
	var query = "SELECT " + strings.Join(environmentsColumns, ",") + " FROM environments WHERE project_id = $1"

	return &entities, DbGet().Select(&entities, query, projectId)
}

func EnvironmentsCreate(entity *Environment) error {
	var query = strings.Join([]string{
		"INSERT INTO environments",
		"(", strings.Join(environmentsColumns, ","), ")",
		"VALUES",
		"(:" + strings.Join(environmentsColumns, ",:"), ")",
	}, " ")
	_, err := DbGet().NamedExec(query, entity)
	return err
}

func EnvironmentsUpdate(entity *Environment) error {
	updates := []string{}
	for _, column := range environmentsColumns {
		if column == "id" {
			continue
		}
		updates = append(updates, column+"=:"+column)
	}
	var query = "UPDATE environments SET " + strings.Join(updates, ",") + " WHERE id=:id"
	_, err := DbGet().NamedExec(query, entity)
	return err
}
