import * as ActionTypes from '../actions';
import EnvironmentForm from '../components/environment-form.jsx';
import ProjectNav from '../components/project-nav.jsx';
import React, { Component } from 'react';
import { STATUS_SUCCESS } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class ProjectsCreatePage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch, currentUser } = this.props;

        // Ensure auth
        if (!currentUser) {
            dispatch(ActionTypes.fetchCurrentUser());
        }
    }

    componentWillReceiveProps(nextProps) {
        const { environment } = nextProps;

        if (environment.status === STATUS_SUCCESS) {
            const id = project.data.id;
            this.props.dispatch(push(`/projects/${id}`));
        }
    }

    handleSubmit() {
        const { dispatch } = this.props;
        dispatch(ActionTypes.environmentsCreate(environment));
    }

    render() {
        const { projectId, environment } = this.props;

        return (
            <div>
                <ProjectNav
                    projects={[]}
                    project={{data: {id: projectId}}}
                    isOnRelatedPage={true}
                />

                <div className="container">
                    <h1 className="box__header">New Environment</h1>
                    <div className="box">
                        <EnvironmentForm
                            submitLabel="Create"
                            environment={environment}
                            savedEnvironment={environment}
                            onSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { projectId } = ownProps.params;
    const { entities } = state;
    const currentUser = entities.users.current;
    const environment = entities.environments.created || {};

    return {projectId, currentUser, environment};
};

export default connect(mapStateToProps)(ProjectsCreatePage);
