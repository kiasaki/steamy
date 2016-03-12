import { merge, clone, map, fromPairs } from 'ramda';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { API_UPDATE } from '../lib/api-middleware';
import * as ActionTypes from '../actions';

function createReducer(type, paramName, deflt) {
    return function (state, action) {
        switch (action.type) {
        case type:
            return action[paramName];
        default:
            if (typeof state === 'undefined') {
                return deflt;
            }
            return state;
        }
    };
}

const authToken = createReducer(ActionTypes.SET_AUTH_TOKEN, 'authToken', null);

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

        if (!response) {
            const newEntities = clone(state[entityType]);
            delete newEntities[id];
            return merge(state, {[entityType]: newEntities});
        }

        if ('data' in response && Array.isArray(response.data)) {
            const entities = fromPairs(map(entity => {
                const entityResponse = clone(response);
                entityResponse.data = entity;
                return [entity.id, entityResponse];
            }, response.data));

            return merge(state, {
                [entityType]: merge(state[entityType], entities)
            });
        }

        return merge(state, {
            [entityType]: merge(state[entityType], {
                [id]: response
            })
        });
    }

    return state;
};

const rootReducer = combineReducers({
    routing: routerReducer,
    entities,
    authToken
});

export default rootReducer;
