import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { sortBy, map, filter, reverse, prop, propEq, values } from 'ramda';
import { STATUS_SUCCESS } from '../lib/api-middleware';

import * as ActionTypes from '../actions';
import SimpleNav from '../components/simple-nav.jsx';

class ProjectsIndexPage extends Component {
    componentDidMount() {
        const { dispatch, currentUser } = this.props;

        if (!currentUser) {
            dispatch(ActionTypes.fetchCurrentUser());
        }

        dispatch(ActionTypes.projectsFetchList());
    }

    createHandleShow(id) {
        const projectId = id;
        return () => {
            this.props.dispatch(push(`/projects/${projectId}`));
        };
    }

    render() {
        const { projects } = this.props;
        let content;

        if (projects.length === 0) {
            content = (
                <div className="empty-state">
                    <h1>You have no projects yet!</h1>
                    <span>
                        <Link to="/projects/create">Create one!</Link>
                    </span>
                </div>
            );
        } else {
            content = (
                <div>
                    {map(p => (
                        <div key={p.id} className="box project-summary cf">
                            <div className="pull-left project-summary__title" onClick={this.createHandleShow(p.id)}>
                                <i className="fa fa-plus-circle project-summary__title__expand" />
                                <h1>{p.title}</h1>
                                <span>Deployed on 0 servers</span>
                            </div>
                            <div className="pull-right project-summary__settings">
                                <Link to="/">
                                    <i className="fa fa-cog" />
                                </Link>
                            </div>
                            <div className="pull-right project-summary__deployment">
                            </div>
                        </div>
                     ), projects)}
                </div>
            );
        }

        return (
            <div>
                <SimpleNav title="Projects" />

                <div className="container">
                    {content}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { authToken, entities } = state;
    const currentUser = entities.users.current;
    const projectResponses = map(prop('data'), filter(
        propEq('status', STATUS_SUCCESS),
        values(entities.projects)
    ));
    const projects = reverse(sortBy(prop('updated'), projectResponses));

    return {currentUser, projects};
};

export default connect(mapStateToProps)(ProjectsIndexPage);
