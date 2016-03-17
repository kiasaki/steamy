package main

import (
	"fmt"
	"os"
)

func errorAndExit(err error) {
	fmt.Println(err)
	os.Exit(1)
}

var quitChan = make(chan (struct{}), 1)

func errorAndStartExiting(err error) {
	fmt.Printf("error: %v", err)
	quitChan <- struct{}{}
}
