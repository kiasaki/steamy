import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './containers/app.jsx';
import DashboardPage from './containers/dashboard-page.jsx';
import SigninPage from './containers/signin-page.jsx';
import SignoutPage from './containers/signout-page.jsx';
import UsersPage from './containers/users-page.jsx';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={DashboardPage} />
        <Route path="users" component={UsersPage} />
        <Route path="signin" component={SigninPage} />
        <Route path="signout" component={SignoutPage} />
    </Route>
);
