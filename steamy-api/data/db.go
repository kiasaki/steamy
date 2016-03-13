package data

import (
	"errors"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB

func DbInit(connectionString string) (err error) {
	db, err = sqlx.Open("postgres", connectionString)
	return
}

func DbClose() {
	db.Close()
}

func DbGet() *sqlx.DB {
	return db
}

func sqlForFetchList(tableName string, columns []string, order string, limit int, wheres map[string]interface{}) (string, []interface{}, error) {
	// Order: Direction
	var sortDirection = "ASC"
	if order[0] == '-' {
		sortDirection = "DESC"
		order = order[1:]
	}

	// Order: Validity check
	var orderBySql = ""
	if order != "" {
		var validOrderColumn = false
		for _, column := range buildsColumns {
			if column == order {
				validOrderColumn = true
			}
		}
		if !validOrderColumn {
			return "", []interface{}{}, errors.New("Invalid sort order column")
		}
		orderBySql = "ORDER BY " + order + " " + sortDirection
	}

	// Where
	var whereSql = ""
	var whereColumns = []string{}
	var whereValues = []interface{}{}
	for column, value := range wheres {
		whereColumns = append(whereColumns, column)
		whereValues = append(whereValues, value)
	}
	if len(whereColumns) > 0 {
		whereSql = "WHERE " + strings.Join(whereColumns, ",")
	}

	// Limit
	var limitSql = ""
	if limit != 0 {
		limitSql = "LIMIT " + strconv.Itoa(limit)
	}

	var query = strings.Join([]string{
		"SELECT", strings.Join(columns, ","),
		"FROM", tableName, whereSql, orderBySql, limitSql,
	}, " ")

	return query, whereValues, nil
}
