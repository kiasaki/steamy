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
	Id            string           `json:"id"`
	BuildId       string           `json:"build_id"`
	ProjectId     string           `json:"project_id"`
	EnvironmentId string           `json:"environment_id"`
	Kind          DeploymentKind   `json:"kind"`
	Status        DeploymentStatus `json:"status"`
	Created       time.Time        `json:"created"`
	Updated       time.Time        `json:"updated"`
}

type Deployments []Deployment

var DeploymentNotFound = &Deployment{}
