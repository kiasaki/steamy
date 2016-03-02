package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {
	SetOKResponse(w, J{
		"data": J{
			"version": "v1",
			"motd":    "Steamy API V1",
		},
	})
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

func ProjectsCreate(w http.ResponseWriter, r *http.Request) {
	var project Project

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		panic(err)
	}

	if err := r.Body.Close(); err != nil {
		panic(err)
	}

	if err := json.Unmarshal(body, &project); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}

	// create in db
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(struct{}{}); err != nil {
		panic(err)
	}
}
