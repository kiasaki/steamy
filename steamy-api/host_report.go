package main

import "time"

type HostReport struct {
	Id        string
	HostId    string
	HostName  string
	HostState HostState
	ProjectId string
	DeployId  string
	State     string
	Created   time.Time
	Updated   time.Time
}

type HostReports []HostReport
