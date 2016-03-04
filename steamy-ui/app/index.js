import './styles/normalize.css';
import './styles/skeleton.css';
import './styles/app.css';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createHistory } from 'history';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import api from './lib/api-middleware';
import rootReducer from './reducers';
import routes from './routes';
import { getPersistedToken } from './lib/auth';

const authToken = getPersistedToken();

const store = compose(
    applyMiddleware(thunk, api('/signin')),
    reduxReactRouter({
        routes,
        createHistory
    })
)(createStore)(rootReducer, {authToken});

window.store = store;

ReactDOM.render((
    <Provider store={store}>
        <ReduxRouter routes={routes} />
    </Provider>
), document.getElementById('app'));
