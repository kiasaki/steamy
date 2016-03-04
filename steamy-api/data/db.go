package data

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var db *sql.DB

func DbInit(connectionString string) (err error) {
	db, err = sql.Open("postgres", connectionString)
	return
}

func DbClose() {
	db.Close()
}

func DbQuery(query string, args ...interface{}) (*sql.Rows, error) {
	return db.Query(query, args...)
}

func DbQueryRow(query string, args ...interface{}) *sql.Row {
	return db.QueryRow(query, args...)
}

func DbExec(query string, args ...interface{}) (int64, error) {
	result, err := db.Exec(query, args...)
	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
