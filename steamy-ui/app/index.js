import './styles/normalize.css';
import './styles/skeleton.css';
import './styles/app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createHistory } from 'history';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import { getPersistedToken } from './lib/auth';

import routes from './routes';
import rootReducer from './reducers';

const authToken = getPersistedToken();

const store = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)(rootReducer, {authToken});

ReactDOM.render((
    <Provider store={store}>
        <ReduxRouter routes={routes} />
    </Provider>
), document.getElementById('app'));
