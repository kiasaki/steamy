package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

const STEAMY_URL = "STEAMY_URL"
const STEAMY_VERSION = "STEAMY_VERSION"
const STEAMY_TOKEN = "STEAMY_TOKEN"

const SUPPORTED_STEAMY_VERSION = "v1"

var configSteamyUrl string
var configSteamyVersion string
var configSteamyToken string

var configPublish bool

var publishVersion string
var publishArtifact string
var publishProject string
var publishRepoUrl string
var publishRepoName string
var publishRepoBranch string
var publishRepoCommit string
var publishPublisher string

func init() {
	flag.StringVar(&configSteamyUrl, "steamy-url", "", "Steamy API Url (STEAMY_URL)")
	flag.StringVar(&configSteamyVersion, "steamy-version", "v1", "Steamy API Version (STEAMY_VERSION)")
	flag.StringVar(&configSteamyToken, "steamy-token", "", "Steamy API Token (STEAMY_TOKEN)")

	flag.BoolVar(&configPublish, "publish", false, "Run: Publish a build")

	flag.StringVar(&publishVersion, "version", "", "Build version")
	flag.StringVar(&publishArtifact, "artifact", "", "Path to build artifact")
	flag.StringVar(&publishProject, "project", "", "Project name the build belongs to")
	flag.StringVar(&publishRepoUrl, "repo-url", "", "VCS Repository url")
	flag.StringVar(&publishRepoName, "repo-name", "", "VCS Repository name")
	flag.StringVar(&publishRepoBranch, "repo-branch", "", "VCS Repository branch")
	flag.StringVar(&publishRepoCommit, "repo-commit", "", "VCS Repository commit")
	flag.StringVar(&publishPublisher, "publisher", "", "Publisher email")

	flag.Parse()

	steamyConfigCheck()
}

func main() {
	if configPublish {
		runPublish()
	} else {
		flag.Usage()
	}
}

func steamyConfigCheck() {
	// Fallback to env
	if configSteamyUrl == "" {
		configSteamyUrl = os.Getenv(STEAMY_URL)
	}
	if configSteamyVersion == "" {
		configSteamyVersion = os.Getenv(STEAMY_VERSION)
	}
	if configSteamyToken == "" {
		configSteamyToken = os.Getenv(STEAMY_TOKEN)
	}

	// Error on missing config
	if configSteamyUrl == "" {
		fmt.Printf("Error: Missing '-steamy-url' or '%v' config\n", STEAMY_URL)
		os.Exit(1)
	}
	if configSteamyVersion != SUPPORTED_STEAMY_VERSION {
		fmt.Printf(
			"Error: Unsuported %v. Got '%v' wanted '%v'\n",
			STEAMY_VERSION,
			configSteamyVersion,
			SUPPORTED_STEAMY_VERSION,
		)
		os.Exit(1)
	}
	if configSteamyToken == "" {
		fmt.Printf("Error: Missing '-steamy-token' or '%v' config\n", STEAMY_TOKEN)
		os.Exit(1)
	}
}

func runPublish() {
	if publishVersion == "" {
		fmt.Println("Error: Missing 'version' parameter")
		os.Exit(1)
	}

	if publishArtifact == "" {
		fmt.Println("Error: Missing 'artifact' parameter")
		os.Exit(1)
	}

	if fileInfo, err := os.Stat(publishArtifact); os.IsNotExist(err) {
		fmt.Println("Error: Invalid 'artifact' parameter. Not a file.")
		os.Exit(1)
	} else if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	} else if fileInfo.IsDir() {
		fmt.Println("Error: Invalid 'artifact' parameter. Directory given, not a file.")
		os.Exit(1)
	} else if fileInfo.Name()[len(fileInfo.Name())-7:] != ".tar.gz" {
		fmt.Println("Error: Invalid 'artifact' parameter. Not a '.tar.gz' archive.")
		os.Exit(1)
	}

	fmt.Println("Publishing...")
	err := runPublishUpload(publishArtifact, map[string]string{
		"version":     publishVersion,
		"project":     publishProject,
		"repo_url":    publishRepoUrl,
		"repo_name":   publishRepoName,
		"repo_branch": publishRepoBranch,
		"repo_commit": publishRepoCommit,
		"publisher":   publishPublisher,
	})
	if err != nil {
		fmt.Printf("Error publishing: %v\n", err)
		os.Exit(1)
	}
}

func runPublishUpload(artifact string, params map[string]string) (err error) {
	artifactFile, err := os.Open(artifact)
	if err != nil {
		return
	}
	defer artifactFile.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add build artifact
	part, err := writer.CreateFormFile("artifact", filepath.Base(artifact))
	if err != nil {
		return
	}
	_, err = io.Copy(part, artifactFile)
	if err != nil {
		return
	}

	// Add the other fields
	for key, val := range params {
		err = writer.WriteField(key, val)
		if err != nil {
			return
		}
	}
	err = writer.Close()
	if err != nil {
		return
	}

	req, err := http.NewRequest("POST", configSteamyUrl, body)
	if err != nil {
		return
	}

	// Don't forget to set the content type, this will contain the boundary.
	req.Header.Set("Content-Type", writer.FormDataContentType())

	req.Header.Set("Api-Token", configSteamyToken)

	// Submit the request
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return
	}
	defer res.Body.Close()

	// Check the response
	if res.StatusCode != http.StatusOK {
		err = fmt.Errorf("Bad status from api: %s", res.Status)
		return
	}

	// Write out answer
	answer, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return
	}
	fmt.Println(answer)

	return
}
