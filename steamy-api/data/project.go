package data

import (
	"strings"
	"time"
)

type Project struct {
	Id      string    `json:"id" db:"id"`
	Title   string    `json:"title" db:"title"`
	Created time.Time `json:"created" db:"created"`
	Updated time.Time `json:"updated" db:"updated"`
}

type Projects []Project

var ProjectNotFound = &Project{}

var projectsColumns = []string{"id", "title", "created", "updated"}

func ProjectsFetchList() (*Projects, error) {
	var entities = Projects{}
	var query = "SELECT " + strings.Join(projectsColumns, ",") + " FROM projects"

	return &entities, DbGet().Select(&entities, query)
}

func ProjectsFetchOne(id string) (*Project, error) {
	var entity = Project{}
	var query = "SELECT " + strings.Join(projectsColumns, ",") + " FROM projects WHERE id=$1"

	return &entity, DbGet().Get(&entity, query, id)
}

func ProjectsFetchOneByTitle(title string) (*Project, error) {
	var entity = Project{}
	var query = "SELECT " + strings.Join(projectsColumns, ",") + " FROM projects WHERE title=$1"

	return &entity, DbGet().Get(&entity, query, title)
}

func ProjectsCreate(entity *Project) error {
	var query = "INSERT INTO projects (" + strings.Join(projectsColumns, ",") + ") VALUES (:" + strings.Join(projectsColumns, ",:") + ")"
	_, err := DbGet().NamedExec(query, entity)
	return err
}

func ProjectsUpdate(entity *Project) error {
	updates := []string{}
	for _, column := range projectsColumns {
		if column == "id" {
			continue
		}
		updates = append(updates, column+"=:"+column)
	}
	var query = "UPDATE projects SET " + strings.Join(updates, ",") + " WHERE id=:id"
	_, err := DbGet().NamedExec(query, entity)
	return err
}

func ProjectsDestroy(id string) error {
	var query = "DELETE FROM projects WHERE id=$1 LIMIT 1"
	_, err := DbGet().Exec(query, id)
	return err
}
