import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './containers/app.jsx';

import ProjectsShowPage from './containers/projects-show-page.jsx';
import ProjectsIndexPage from './containers/projects-index-page.jsx';
import ProjectsCreatePage from './containers/projects-create-page.jsx';
import ProjectsSettingsPage from './containers/projects-settings-page.jsx';

import HostsIndexPage from './containers/hosts-index-page.jsx';

import UsersIndexPage from './containers/users-index-page.jsx';
import UsersCreatePage from './containers/users-create-page.jsx';
import UsersShowPage from './containers/users-show-page.jsx';

import SigninPage from './containers/signin-page.jsx';
import SignoutPage from './containers/signout-page.jsx';
import NotFoundPage from './containers/not-found-page.jsx';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={ProjectsIndexPage} />
        <Route path="projects/create" component={ProjectsCreatePage} />
        <Route path="projects/:id" component={ProjectsShowPage} />
        <Route path="projects/:id/settings" component={ProjectsSettingsPage} />

        <Route path="hosts" component={HostsIndexPage} />

        <Route path="users" component={UsersIndexPage} />
        <Route path="users/create" component={UsersCreatePage} />
        <Route path="users/:id" component={UsersShowPage} />

        <Route path="signin" component={SigninPage} />
        <Route path="signout" component={SignoutPage} />
        <Route path="*" component={NotFoundPage} />
    </Route>
);
