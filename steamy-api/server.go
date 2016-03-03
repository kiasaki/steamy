package main

import (
	"flag"
	"log"
	"net/http"
	"strconv"
)

var configPort int
var configDatabaseUrl string
var configToken string
var configBuildsDir string

func init() {
	flag.IntVar(&configPort, "port", 9484, "Port to listen on")
	flag.StringVar(&configDatabaseUrl, "database-url", "postgres://localhost/steamy", "Database connection string")
	flag.StringVar(&configToken, "token", "keyboardcat", "Secret API Token")
	flag.StringVar(&configBuildsDir, "builds-dir", "./builds", "Directory to store uploaded build artifacts in")
}

func main() {
	flag.Parse()

	err := DbInit(configDatabaseUrl)
	if err != nil {
		log.Fatal(err)
	}

	router := NewRouter()
	var stringPort = strconv.Itoa(configPort)
	log.Println("listening on port: " + stringPort)
	log.Fatal(http.ListenAndServe(":"+stringPort, router))
}
