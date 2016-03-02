package main

import "net/http"

func RequireAuthentication(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var apiToken = r.Header.Get("Api-Token")

		if apiToken == configToken {
			inner.ServeHTTP(w, r)
		} else {
			SetUnauthorizedResponse(w)
			WriteEntity(w, J{
				"error": "Unauthorized",
			})
		}
	})
}
