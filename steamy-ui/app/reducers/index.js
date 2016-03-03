import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

const entitiesReducer = (state = {}, action) => {
    return state;
};

const rootReducer = combineReducers({
  router: routerStateReducer,
  entities: entitiesReducer
});

export default rootReducer;
