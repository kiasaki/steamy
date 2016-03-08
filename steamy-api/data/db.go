package data

import (
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
