import * as ActionTypes from '../actions';
import EnvironmentForm from '../components/environment-form.jsx';
import ProjectNav from '../components/project-nav.jsx';
import React, { Component } from 'react';
import { STATUS_REQUEST, STATUS_FAILURE, STATUS_SUCCESS, API_UPDATE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { merge } from 'ramda';
import { push } from 'react-router-redux';

class EnvironmentsSettingsPage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch, id } = this.props;
        dispatch(ActionTypes.environmentsFetchOne(id));
    }

    componentWillReceiveProps(nextProps) {
        const { projectId, updatedEnvironment } = nextProps;

        if (updatedEnvironment.status === STATUS_SUCCESS) {
            this.props.dispatch(push(`/projects/${projectId}`));
        }
    }

    componentWillUnmount() {
        // Reset updated environment for clean state on next user edit
        this.props.dispatch({
            type: API_UPDATE,
            entityType: 'environments',
            id: 'updated',
            response: null
        });
    }

    handleSubmit(formState) {
        const { dispatch, environment } = this.props;

        const environmentToSave = merge(environment.data, formState);

        // Convert comma separated lists to actual arrays
        if (!Array.isArray(environmentToSave.groups)) {
            environmentToSave.groups = environmentToSave.groups.split(',').map(s => s.trim());
        }
        if (!Array.isArray(environmentToSave.hosts)) {
            environmentToSave.hosts = environmentToSave.hosts.split(',').map(s => s.trim());
        }

        dispatch(ActionTypes.environmentsUpdate(environmentToSave));
    }

    render() {
        const { projectId, environment, updatedEnvironment } = this.props;

        if (!environment || environment.status == STATUS_REQUEST) {
            return (
                <h3 className="text-center">Loading...</h3>
            );
        } else if (environment.status == STATUS_FAILURE) {
            return (
                <div className="container">
                    <br />
                    <div className="alert alert--error">{environment.error}</div>
                </div>
            );
        }

        return (
            <div>
                <ProjectNav
                    projects={[]}
                    project={{data: {id: projectId}}}
                    isOnRelatedPage={true}
                />

                <div className="container">
                    <h1 className="box__header">Environment Settings</h1>
                    <div className="box">
                        <EnvironmentForm
                            submitLabel="Save"
                            environment={environment}
                            savedEnvironment={updatedEnvironment}
                            onSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { projectId, id } = ownProps.params;
    const { entities } = state;
    const environment = entities.environments[id] || {};
    const updatedEnvironment = entities.environments.updated || {};

    return {projectId, id, environment, updatedEnvironment};
};

export default connect(mapStateToProps)(EnvironmentsSettingsPage);
