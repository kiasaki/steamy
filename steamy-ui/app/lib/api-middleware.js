import 'isomorphic-fetch';

import queryString from 'query-string';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { push } from 'react-router-redux';

const API_ROOT = window.env.root_url;

function handleResponse ([ response, body ]) {
    let json;
    try {
        json = JSON.parse(body);
    } catch (e) {
        json = {};
    }

    const camelizedJson = camelizeKeys(json);
    camelizedJson.statusCode = response.status;

    if (!response.ok) {
        return Promise.reject(camelizedJson);
    }
    return camelizedJson;
}

function callApi(action, authToken) {
    const { endpoint, method, body, params } = action;
    let fullUrl = API_ROOT + endpoint;

    const options = {
        method: 'GET'
    };
    if (method) {
        options.method = method;
    }
    if (params) {
        fullUrl += `?${queryString.stringify(params)}`;
    }
    if (body) {
        options.body = JSON.stringify(decamelizeKeys(body));
    }

    const headers = new Headers();
    options.headers = headers;
    headers.set('Accept', 'application/json');
    if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
    }
    if (method !== 'GET' && body) {
        headers.set('Content-Type', 'application/json');
    }

    return fetch(fullUrl, options)
        .then(response => Promise.all([response, response.text()]))
        .then(handleResponse);
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// Action type for results dispatched
export const API_UPDATE = Symbol('API_UPDATE');
export const STATUS_REQUEST = Symbol('STATUS_REQUEST');
export const STATUS_SUCCESS = Symbol('STATUS_SUCCESS');
export const STATUS_FAILURE = Symbol('STATUS_FAILURE');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default redirectUri => store => next => action => {
    const apiCall = action[CALL_API];

    // Skip actions that don't concern this middleware
    if (typeof apiCall === 'undefined') {
        return next(action);
    }

    const { entityType, id } = apiCall;
    let { endpoint } = apiCall;

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }
    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }
    if (typeof entityType !== 'string') {
        throw new Error('Specify a entity type.');
    }
    if (typeof id !== 'string') {
        throw new Error('Specify an entity id.');
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data, {
            type: API_UPDATE,
            entityType, id
        });
        delete finalAction[CALL_API];
        return finalAction;
    }

    next(actionWith({
        response: {status: STATUS_REQUEST, data: {}}
    }));

    return callApi(apiCall, store.getState().authToken)
        .then(response => {
            response.status = STATUS_SUCCESS;
            return next(actionWith({response}));
        }, response => {
            if (
                response.statusCode === 401
            ) {
                // When returned a 401 redirect to login
                // That way any page load requesting enpoints needing
                // authorization don't need to worry about auth flow
                return next(push(redirectUri));
            }

            response.status = STATUS_FAILURE;
            return next(actionWith({response}));
        });
};
