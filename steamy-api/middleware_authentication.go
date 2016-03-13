package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"github.com/kiasaki/steamy/steamy-api/data"
)

func RequireAuthentication(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		var token *jwt.Token
		var userId string
		var user *data.User
		var tokenString string
		var prefixLength = len("Bearer ")
		var apiAuthorization = r.Header.Get("Authorization")
		var apiToken = r.Header.Get("X-Api-Token")
		if apiToken == "" {
			apiToken = r.URL.Query().Get("api_token")
		}

		// Try token auth
		if apiToken == configToken {
			// Skip ahead as one valid auth type is enough
			goto success
		}

		// Try user api token
		user, err = data.UsersFetchOneByApiToken(apiToken)
		if err != nil && err != sql.ErrNoRows {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Failed to fetch user for api authorization"})
			return
		} else if err != sql.ErrNoRows {
			// We got a user that matches the api token provided
			context.Set(r, "currentUser", user)
			context.Set(r, "currentUserId", user.Id)
			goto success
		}

		// Try bearer auth
		if len(apiAuthorization) <= prefixLength {
			goto failure
		}

		tokenString = apiAuthorization[prefixLength:]

		token, err = jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the alg is the one we used to sign token
			if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(configSecret), nil
		})

		// Is the token valid?
		if err != nil || !token.Valid {
			goto failure
		}

		// Is the needed uid even in there?
		if token.Claims["uid"] == nil {
			goto failure
		}

		userId = token.Claims["uid"].(string)
		user, err = data.UsersFetchOne(userId)

		// Is user deleted?
		if err != nil || user.Deleted {
			goto failure
		}

		context.Set(r, "currentUser", user)
		context.Set(r, "currentUserId", userId)

		// Request passed all checks, go on
	success:
		inner.ServeHTTP(w, r)
		return

		// Reject unauthorized user
	failure:
		SetUnauthorizedResponse(w)
		WriteEntity(w, J{
			"error": "Unauthorized",
		})
	})
}
