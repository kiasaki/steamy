package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Steamy API v1")
}

func ProjectsIndex(w http.ResponseWriter, r *http.Request) {
	projects := Projects{
		Project{Id: "1", Name: "App"},
		Project{Id: "2", Name: "Api"},
	}

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(projects); err != nil {
		panic(err)
	}
}
