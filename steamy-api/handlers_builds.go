package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/kiasaki/steamy/steamy-api/data"
)

func V1BuildsIndex(w http.ResponseWriter, r *http.Request) {
	var err error

	var order = r.URL.Query().Get("order")

	var limit = 0
	if r.URL.Query().Get("limit") != "" {
		limit, err = strconv.Atoi(r.URL.Query().Get("limit"))
		if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Invalid limit"})
			return
		}
	}

	var filter = r.URL.Query().Get("filter")
	var wheres = map[string]interface{}{}
	if filter != "" {
		err = json.Unmarshal([]byte(filter), &wheres)
		if err != nil {
			SetInternalServerErrorResponse(w, err)
			WriteEntity(w, J{"error": "Invalid filter format"})
			return
		}
	}

	builds, err := data.BuildsFetchList(order, limit, wheres)
	SetOKResponse(w, J{"data": builds})
}
