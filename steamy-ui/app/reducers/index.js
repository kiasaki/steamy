import { merge, clone } from 'ramda';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { API_UPDATE } from '../lib/api-middleware';
import * as ActionTypes from '../actions';

function createReducer(type, paramName, deflt) {
    return function (state, action) {
        state = state || deflt;

        switch (action.type) {
        case type:
            return action[paramName];
        default:
            return state;
        }
    };
}

const authToken = createReducer(ActionTypes.SET_AUTH_TOKEN, 'authUser', null);
const authUser = createReducer(ActionTypes.SET_AUTH_USER, 'authToken', null);

const entitiesReducerDefaultState = {
    users: {},
    hosts: {},
    builds: {},
    tokens: {},
    projects: {},
    deployments: {},
    environments: {}
};
const entities = (state = entitiesReducerDefaultState, action) => {
    if (action.type === API_UPDATE) {
        const { entityType, id, response } = action;

        if ('data' in response && Array.isArray(response.data)) {
            for (const entity in response.data) {
                const entityResponse = clone(response);
                entityResponse.data = entity;
                state[entityType] = merge(state[entityType], {
                    [id]: entityResponse
                });
            }
        } else {
            state[entityType] = merge(state[entityType], {
                [id]: response
            });
        }

        return state;
    }

    return state;
};

const rootReducer = combineReducers({
    routing: routerReducer,
    entities,
    authToken,
    authUser
});

export default rootReducer;
