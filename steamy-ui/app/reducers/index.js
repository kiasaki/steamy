import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

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

const entitiesReducer = (state = {}, action) => {
    return state;
};

const rootReducer = combineReducers({
    router: routerStateReducer,
    entities: entitiesReducer,
    authToken,
    authUser
});

export default rootReducer;
