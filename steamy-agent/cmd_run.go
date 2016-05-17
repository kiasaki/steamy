package main

import (
	"fmt"
	"os"
	"time"
)

func cmdRun(config *Config) {
	fmt.Println("state: started")

	upTicker := time.Tick(30 * time.Second)
	time.Sleep(5 * time.Second) // makes ups and checks spaced out a bit
	checkForTaskTicker := time.Tick(15 * time.Second)

	for {
		select {
		case <-upTicker:
			fmt.Println("action: send up")
			sendUp(config)
		case <-checkForTaskTicker:
			fmt.Println("action: check for tasks")
			checkForTasks(config)
		case <-quitChan:
			fmt.Println("status: quitting")
			os.Exit(0)
		default:
			time.Sleep(2 * time.Second)
		}
	}
}
