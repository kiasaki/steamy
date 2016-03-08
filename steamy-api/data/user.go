package data

import (
	"database/sql"
	"time"
)

type User struct {
	Id       string    `json:"id"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Deleted  bool      `json:"deleted"`
	Created  time.Time `json:"created"`
}

type Users []User

var UserNotFound = &User{}

func UsersFetchList() (*Users, error) {
	var users Users
	var query = `SELECT id, email, password, deleted, created FROM users`
	rows, err := DbQuery(query)
	if err != nil {
		return &users, err
	}

	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Email, &user.Password, &user.Deleted, &user.Created)
		if err != nil {
			return &users, err
		}
		users = append(users, user)
	}

	err = rows.Err()
	return &users, err
}

func MakeUsersFetchOne(fieldName string) func(string) (*User, error) {
	return func(value string) (*User, error) {
		var e User
		var query = `SELECT id, email, password, deleted, created FROM users WHERE ` + fieldName + ` = $1`
		row := DbQueryRow(query, value)
		err := row.Scan(&e.Id, &e.Email, &e.Password, &e.Deleted, &e.Created)

		switch {
		case err == sql.ErrNoRows:
			return UserNotFound, nil
		default:
			return &e, err
		}
	}
}

var UsersFetchOne = MakeUsersFetchOne("id")
var UsersFetchOneByEmail = MakeUsersFetchOne("email")

// Use bcrypt.GenerateFromPassword for new password

func UsersCreate(user *User) error {
	var query = `INSERT INTO users (id, email, password, deleted, created) VALUES ($1, $2, $3, $4)`
	_, err := DbExec(query, user.Id, user.Email, user.Password, user.Deleted, user.Created)
	return err
}

func UsersUpdate(user *User) error {
	var query = `UPDATE users SET email=$2, password=$3, deleted=$4, created=$5 WHERE id=$1`
	_, err := DbExec(query, user.Id, user.Email, user.Password, user.Deleted, user.Created)
	return err
}

func UsersDestroy(id string) error {
	var query = `DELETE FROM users WHERE id=$1 LIMIT 1`
	_, err := DbExec(query, id)
	return err
}
