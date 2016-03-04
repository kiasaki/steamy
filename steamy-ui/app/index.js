import './styles/normalize.css';
import './styles/skeleton.css';
import './styles/app.css';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { Router, browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import api from './lib/api-middleware';
import rootReducer from './reducers';
import routes from './routes';
import { getPersistedToken } from './lib/auth';

const authToken = getPersistedToken();

const rrrMiddleware = routerMiddleware(browserHistory);
const store = applyMiddleware(
    thunk, api('/signin'), rrrMiddleware
)(createStore)(rootReducer, {authToken});

window.store = store;

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>
), document.getElementById('app'));
