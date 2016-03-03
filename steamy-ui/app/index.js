import './app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createHistory } from 'history';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import routes from './routes';
import rootReducer from './reducers';

const store = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)(rootReducer);

ReactDOM.render((
    <Provider store={store}>
        <ReduxRouter routes={routes} />
    </Provider>
), document.getElementById('app'));
