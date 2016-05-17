package main

import (
	"github.com/kiasaki/steamy/steamy-api/client"
)

func sendUp(config *Config) {
	err := client.HostsUp(client.HostsUpRequest{
		Name:   config.Name,
		Groups: config.Groups,
	})
	if err != nil {
		logEvent("Error: SendUp: " + err.Error())
	}
}
