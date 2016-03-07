package data

import (
	"database/sql"
	"time"
)

type Project struct {
	Id      string    `json:"id"`
	Title   string    `json:"title"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

type Projects []Project

var ProjectNotFound = &Project{}

var projectSqlParams = "id, title, created, updated"

func ProjectsFetchList() (*Projects, error) {
	var entities Projects
	var query = `SELECT ` + projectSqlParams + ` FROM projects`
	rows, err := DbQuery(query)
	if err != nil {
		return &entities, err
	}

	defer rows.Close()

	for rows.Next() {
		var e Project
		err := rows.Scan(&e.Id, &e.Title, &e.Created, &e.Updated)
		if err != nil {
			return &entities, err
		}
		entities = append(entities, e)
	}

	err = rows.Err()
	return &entities, err
}

func MakeProjectsFetchOne(fieldName string) func(string) (*Project, error) {
	return func(field string) (*Project, error) {
		var e Project
		var query = `SELECT ` + projectSqlParams + ` FROM projects WHERE ` + fieldName + ` = $1`
		row := DbQueryRow(query, field)
		err := row.Scan(&e.Id, &e.Title, &e.Created, &e.Updated)

		switch {
		case err == sql.ErrNoRows:
			return ProjectNotFound, nil
		default:
			return &e, err
		}
	}
}

var ProjectsFetchOne = MakeProjectsFetchOne("id")
var ProjectsFetchOneByTitle = MakeProjectsFetchOne("title")

func ProjectsCreate(e *Project) error {
	var query = `INSERT INTO projects (` + projectSqlParams + `) VALUES ($1, $2, $3, $4)`
	_, err := DbExec(query, e.Id, e.Title, e.Created, e.Updated)
	return err
}
