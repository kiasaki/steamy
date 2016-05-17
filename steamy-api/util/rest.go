package util

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

var (
	ErrStatusConflict            error = errors.New(fmt.Sprintf("%d: Conflict", http.StatusConflict))
	ErrStatusBadRequest          error = errors.New(fmt.Sprintf("%d: Bad Request", http.StatusBadRequest))
	ErrStatusInternalServerError error = errors.New(fmt.Sprintf("%d: Internal Server Error", http.StatusInternalServerError))
	ErrStatusNotFound            error = errors.New(fmt.Sprintf("%d: Not Found", http.StatusNotFound))
	ErrStatusUnauthorized        error = errors.New(fmt.Sprintf("%d: Unauthorized", http.StatusUnauthorized))
)

var HttpClient = http.DefaultClient

func MakeRequest(method, url string, entity interface{}) (*http.Response, error) {
	req, err := buildRequest(method, url, entity)
	if err != nil {
		return nil, err
	}
	return http.DefaultClient.Do(req)
}

func MakeRequestWithMiddleware(method, url string, entity interface{}, mid func(*http.Request)) (*http.Response, error) {
	req, err := buildRequest(method, url, entity)
	if err != nil {
		return nil, err
	}
	mid(req)

	return HttpClient.Do(req)
}

func buildRequest(method, url string, entity interface{}) (*http.Request, error) {
	body, err := encodeEntity(entity)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return req, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	return req, err
}

func encodeEntity(entity interface{}) (io.Reader, error) {
	if entity == nil {
		return nil, nil
	} else {
		b, err := json.Marshal(entity)
		if err != nil {
			return nil, err
		}
		return bytes.NewBuffer(b), nil
	}
}

func ProcessResponseBytes(r *http.Response, expectedStatus int) ([]byte, error) {
	if err := processResponse(r, expectedStatus); err != nil {
		return nil, err
	}

	respBody, err := ioutil.ReadAll(r.Body)
	return respBody, err
}

func ProcessResponseEntity(r *http.Response, entity interface{}, expectedStatus int) error {
	if err := processResponse(r, expectedStatus); err != nil {
		return err
	}

	respBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	if entity != nil {
		if err = json.Unmarshal(respBody, entity); err != nil {
			return err
		}
	}
	return nil
}

func processResponse(r *http.Response, expectedStatus int) error {
	if r.StatusCode != expectedStatus {

		switch r.StatusCode {
		case http.StatusConflict:
			return ErrStatusConflict
		case http.StatusBadRequest:
			return ErrStatusBadRequest
		case http.StatusUnauthorized:
			return ErrStatusUnauthorized
		case http.StatusInternalServerError:
			return ErrStatusInternalServerError
		case http.StatusNotFound:
			return ErrStatusNotFound
		default:
			return errors.New("response status of " + r.Status)
		}

	}

	return nil
}
