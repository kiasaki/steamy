package data

import (
	"strings"
	"time"
)

type User struct {
	Id       string    `json:"id" db:"id"`
	Email    string    `json:"email" db:"email"`
	Password string    `json:"password" db:"password"`
	ApiToken string    `json:"api_token" db:"api_token"`
	Deleted  bool      `json:"deleted" db:"deleted"`
	Created  time.Time `json:"created" db:"created"`
}

type Users []User

var UserNotFound = &User{}

var usersColumns = []string{"id", "email", "password", "api_token", "deleted", "created"}

func UsersFetchList() (*Users, error) {
	var entities = Users{}
	var query = "SELECT " + strings.Join(usersColumns, ",") + " FROM users"

	return &entities, DbGet().Select(&entities, query)
}

func UsersFetchOne(id string) (*User, error) {
	var entity = User{}
	var query = "SELECT " + strings.Join(usersColumns, ",") + " FROM users WHERE id=$1"

	return &entity, DbGet().Get(&entity, query, id)
}

func UsersFetchOneByEmail(email string) (*User, error) {
	var entity = User{}
	var query = "SELECT " + strings.Join(usersColumns, ",") + " FROM users WHERE email=$1"

	return &entity, DbGet().Get(&entity, query, email)
}

func UsersCreate(entity *User) error {
	var query = "INSERT INTO users (" + strings.Join(usersColumns, ",") + ") VALUES (:" + strings.Join(usersColumns, ",:") + ")"
	_, err := DbGet().NamedExec(query, entity)
	return err
}

func UsersUpdate(entity *User) error {
	updates := []string{}
	for _, column := range usersColumns {
		if column == "id" {
			continue
		}
		updates = append(updates, column+"=:"+column)
	}
	var query = "UPDATE users SET " + strings.Join(updates, ",") + " WHERE id=:id"
	_, err := DbGet().NamedExec(query, entity)
	return err
}

func UsersDestroy(id string) error {
	var query = "DELETE FROM users WHERE id=$1 LIMIT 1"
	_, err := DbGet().Exec(query, id)
	return err
}
