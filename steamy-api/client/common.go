package client

import (
	"net/http"

	"github.com/kiasaki/steamy/steamy-api/util"
)

type J map[string]interface{}

func request(
	config *Config, method string, path string,
	query map[string]string, body interface{},
) (*http.Response, error) {
	url := config.Url + "/" + config.Version + path

	res, err := util.MakeRequestWithMiddleware(method, url, body, func(req *http.Request) {
		req.Header.Set("X-Api-Token", config.Token)
	})

	return res, err
}
