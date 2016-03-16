package main

import (
	"errors"
	"fmt"

	"github.com/go-ini/ini"
)

type ConfigHost struct {
	Name   string
	Groups string
}

type Config struct {
	SteamyUrl         string
	SteamyVersion     string
	SteamyToken       string
	MaxRetry          int
	NumBuildsToRetain int
	ProcessTimeout    int
	ConfigHost        `ini:"host"`
}

func DefaultConfig() *Config {
	return &Config{
		SteamyUrl:         "http://localhost:9484",
		SteamyVersion:     "v1",
		SteamyToken:       "",
		MaxRetry:          3,
		NumBuildsToRetain: 2,
		ProcessTimeout:    1800,
		ConfigHost: ConfigHost{
			Name:   "",
			Groups: "",
		},
	}
}

func readConfig(path string) *Config {
	config := DefaultConfig()

	configFile, err := ini.Load(path)
	if err != nil {
		errorAndExit(errors.New("Error: reading config from: " + path))
	}
	configFile.NameMapper = ini.TitleUnderscore

	err = configFile.MapTo(config)
	if err != nil {
		errorAndExit(fmt.Errorf("Error: reading config: %v", err))
	}

	if config.ConfigHost.Name == "" {
		errorAndExit(errors.New("Error: Config: Missing host name"))
	}

	return config
}
