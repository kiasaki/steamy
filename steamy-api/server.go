package main

import (
	"flag"
	"log"
	"net/http"
	"strconv"

	"github.com/kiasaki/steamy/steamy-api/data"
)

var configPort int
var configDatabaseUrl string
var configToken string
var configSecret string
var configBuildsDir string

func init() {
	flag.IntVar(&configPort, "port", 9484, "Port to listen on")
	flag.StringVar(&configDatabaseUrl, "database-url", "postgres://localhost/steamy?sslmode=disable", "Database connection string")
	flag.StringVar(&configToken, "token", "keyboardcat", "Global all-access API Token")
	flag.StringVar(&configSecret, "secret", "ghostintheshell", "Secret used to sign/verify JWT tokens")
	flag.StringVar(&configBuildsDir, "builds-dir", "./builds", "Directory to store uploaded build artifacts in")
}

func main() {
	flag.Parse()

	err := data.DbInit(configDatabaseUrl)
	if err != nil {
		log.Fatal(err)
	}

	router := NewRouter()
	var stringPort = strconv.Itoa(configPort)
	log.Println("listening on port: " + stringPort)
	log.Fatal(http.ListenAndServe(":"+stringPort, router))
}
