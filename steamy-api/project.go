package main

import (
	"database/sql"
	"time"
)

type Project struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	Hosts   []string  `json:"hosts"`
	Groups  []string  `json:"groups"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

type Projects []Project

var ProjectNotFound = &Project{}

var projectSqlParams = "id, name, hosts, groups, created, updated"

func ProjectsFetchOneCreator(fieldName string) func(string) (*Project, error) {
	return func(field string) (*Project, error) {
		var e Project
		var query = `SELECT ` + projectSqlParams + ` FROM projects WHERE ` + fieldName + ` = $1`
		row := DbQueryRow(query, field)
		err := row.Scan(&e.Id, &e.Name, &e.Hosts, &e.Groups, &e.Created, &e.Updated)

		switch {
		case err == sql.ErrNoRows:
			return ProjectNotFound, nil
		default:
			return &e, err
		}
	}
}

var ProjectsFetchOne = ProjectsFetchOneCreator("id")
var ProjectsFetchOneByName = ProjectsFetchOneCreator("name")
