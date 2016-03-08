package data

import "time"

type DeploymentKind string

const (
	DeploymentKindRegular  DeploymentKind = "regular"
	DeploymentKindHotfix                  = "hotfix"
	DeploymentKindRollback                = "rollback"
)

type DeploymentStatus string

const (
	DeploymentStatusRunning   DeploymentStatus = "running"
	DeploymentStatusFailing                    = "failing"
	DeploymentStatusFailed                     = "failed"
	DeploymentStatusSucceeded                  = "succeeded"
)

type Deployment struct {
	Id            string           `json:"id" db:"id"`
	BuildId       string           `json:"build_id" db:"build_id"`
	ProjectId     string           `json:"project_id" db:"project_id"`
	EnvironmentId string           `json:"environment_id" db:"environment_id"`
	Kind          DeploymentKind   `json:"kind" db:"kind"`
	Status        DeploymentStatus `json:"status" db:"status"`
	Created       time.Time        `json:"created" db:"created"`
	Updated       time.Time        `json:"updated" db:"updated"`
}

type Deployments []Deployment

var DeploymentNotFound = &Deployment{}
