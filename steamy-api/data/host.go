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
	Id       string     `json:"id" db:"id"`
	Hostname string     `json:"hostname" db:"hostname"`
	Groups   []string   `json:"groups" db:"groups"`
	Ip       string     `json:"ip" db:"ip"`
	Status   HostStatus `json:"status" db:"status"`
	Created  time.Time  `json:"created" db:"created"`
	Updated  time.Time  `json:"updated" db:"updated"`
}

type Hosts []Host
