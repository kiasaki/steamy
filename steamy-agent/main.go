package main

import "flag"

var configFilePath string

func init() {
	flag.StringVar(&configFilePath, "config", "/etc/steamy-agent.ini", "Config file path")
}

func main() {
	flag.Parse()

	config := readConfig(configFilePath)

	restArg := flag.Arg(0)
	switch restArg {
	case "run":
		cmdRun(config)
	case "start":
		cmdStart(config)
	case "stop":
		cmdStop(config)
	case "status":
		cmdStatus(config)
	case "log":
		cmdLog(config)
	case "config":
		cmdConfig(config)
	default:
		flag.Usage()
	}
}
