package data

import "time"

type HostStatus string

const (
	HostStatusActive   HostStatus = "active"
	HostStatusInactive            = "inactive"
	HostStatusMissing             = "missing"
	HostStatusDeleted             = "deleted"
)

type Host struct {
	Id       string     `json:"id"`
	Hostname string     `json:"hostname"`
	Groups   []string   `json:"groups"`
	Ip       string     `json:"ip"`
	Status   HostStatus `json:"status"`
	Created  time.Time  `json:"created"`
	Updated  time.Time  `json:"updated"`
}

type Hosts []Host
