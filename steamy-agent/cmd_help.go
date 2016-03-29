package main

import (
	"flag"
	"fmt"
	"os"
)

func init() {
	flag.Usage = func() {
		fmt.Fprint(os.Stderr, "Steamy Agent is the program that reports to the steamy api and executes builds\nand deployments on servers.")
		fmt.Fprintf(os.Stderr, `

Usage:

  %s [arguments] command

Where arguments are:

`, os.Args[0])
		flag.PrintDefaults()
		fmt.Fprintf(os.Stderr, `
And commands are:

    run       used internally by start to, runs the steamy-agent
    start     starts the steamy agent as a daemon and exits
    stop      stops the steamy agent daemon if running
    status    reports on the current state of the steamy agent daemon
    log       prints a log of the last few actions the agent handled
    config    prints the config currently in use
    help      prints the message you are reading at this very moment
`)
	}
}

func cmdHelp() {
	flag.Usage()
}
