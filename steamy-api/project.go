package main

import "time"

var projectsBucket = []byte("projects")

type Project struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	Hosts   []string  `json:"hosts"`
	Groups  []string  `json:"groups"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

type Projects []Project
