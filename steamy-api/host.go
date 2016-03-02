package main

import "time"

type HostState int

const (
	HostStateActive   HostState = iota
	HostStateInactive           = iota
	HostStateMissing            = iota
	HostStateDeleted            = iota
)

type Host struct {
	Id      string
	Name    string
	Group   string
	Ip      string
	State   HostState
	Created time.Time
	Updated time.Time
}

type Hosts []Host
