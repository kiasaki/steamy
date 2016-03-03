import React from 'react';
import { Route } from 'react-router';

import App from './containers/App.jsx';
import UsersPage from './containers/UsersPage.jsx';

export default (
    <Route component={App}>
        <Route path="/" component={UsersPage} />
    </Route>
);
