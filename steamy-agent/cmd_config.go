package main

import (
	"encoding/json"
	"fmt"
)

func cmdConfig(config *Config) {
	jsonConfig, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		errorAndExit(err)
	}
	fmt.Println(string(jsonConfig))
}
