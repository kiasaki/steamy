package main

import (
	"database/sql"
	"time"
)

type User struct {
	Id       string
	Email    string
	Password string
	Created  time.Time
}

type Users []User

var UserNotFound = &User{}

func UsersFetchList() (*Users, error) {
	var users Users
	var query = `SELECT id, email, password, created FROM users`
	rows, err := DbQuery(query)
	if err != nil {
		return &users, err
	}

	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Email, &user.Password, &user.Created)
		if err != nil {
			return &users, err
		}
		users = append(users, user)
	}

	err = rows.Err()
	return &users, err
}

func UsersFetchOne(id string) (*User, error) {
	var user User
	var query = `SELECT id, email, password, created FROM users WHERE id = $1`
	row := DbQueryRow(query, id)
	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.Created)

	switch {
	case err == sql.ErrNoRows:
		return UserNotFound, nil
	default:
		return &user, err
	}

}

func UsersCreate(user *User) error {
	var query = `INSERT INTO users (id, email, password, created) VALUES ($1, $2, $3, $4)`
	_, err := DbExec(query, user.Id, user.Email, user.Password, user.Created)
	return err
}

func UsersUpdate(user *User) error {
	var query = `UPDATE users SET email=$2, password=$3, created=$4 WHERE id=$1`
	_, err := DbExec(query, user.Id, user.Email, user.Password, user.Created)
	return err
}

func UsersDestroy(id string) error {
	var query = `DELETE FROM users WHERE id=$1 LIMIT 1`
	_, err := DbExec(query, id)
	return err
}
