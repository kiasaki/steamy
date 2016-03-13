package main

import "net/http"

func V1HooksCommit(w http.ResponseWriter, r *http.Request) {
	switch r.Header.Get("X-GitHub-Event") {
	case "ping":
		SetOKResponse(w, J{"message": "Pong!"})
	default:
		SetNotFoundResponse(w)
	}
}
