package client

import (
	"net/http"

	"github.com/kiasaki/steamy/steamy-api/util"
)

type HostsUpRequest struct {
	Name   string
	Groups []string
}

type HostsUpResponse struct {
	Error string
}

func HostsUp(config *Config, reqEntity HostsUpRequest) (HostsUpResponse, error) {
	resEntity := HostsUpResponse{}
	res, err := request(config, "POST", "/host-up", map[string]string{}, reqEntity)
	if err != nil {
		return resEntity, err
	}

	err = util.ProcessResponseEntity(res, &resEntity, http.StatusOK)
	return resEntity, err
}
