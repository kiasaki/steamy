package main

import (
	"net/http"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	Public      bool
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/",
		true,
		Index,
	},
	Route{
		"V1Index",
		"GET",
		"/v1",
		true,
		Index,
	},
	Route{
		"V1ProjectsIndex",
		"GET",
		"/v1/projects",
		false,
		ProjectsIndex,
	},
}
