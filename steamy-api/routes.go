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
		V1ApiIndex,
	},
	Route{
		"V1Index",
		"GET",
		"/v1",
		true,
		V1ApiIndex,
	},
	Route{
		"V1TokensCreate",
		"POST",
		"/v1/tokens",
		true,
		V1TokensCreate,
	},
	Route{
		"V1CurrentUser",
		"GET",
		"/v1/current-user",
		false,
		V1CurrentUser,
	},
	Route{
		"V1ProjectsShow",
		"GET",
		"/v1/projects/{id}",
		false,
		V1ProjectsShow,
	},
	Route{
		"V1ProjectsCreate",
		"POST",
		"/v1/projects",
		false,
		V1ProjectsCreate,
	},
	Route{
		"V1BuildsIndex",
		"GET",
		"/v1/builds",
		false,
		BuildsIndex,
	},
	Route{
		"V1BuildsCreate",
		"POST",
		"/v1/builds",
		false,
		BuildsCreate,
	},
	Route{
		"V1BuildsShowArtifact",
		"GET",
		"/v1/builds/artifacts/{buildId}.tar.gz",
		false,
		BuildsShowArtifact,
	},
}
