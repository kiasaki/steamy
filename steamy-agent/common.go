package main

import (
	"fmt"
	"os"
)

func errorAndExit(err error) {
	fmt.Println(err)
	os.Exit(1)
}
