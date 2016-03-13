import * as ActionTypes from '../actions';
import ProjectFormFields from '../components/project-form-fields.jsx';
import ProjectNav from '../components/project-nav.jsx';
import React, { Component } from 'react';
import { STATUS_SUCCESS, STATUS_FAILURE, API_UPDATE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { mergeWith } from 'ramda';
import { push } from 'react-router-redux';

class ProjectsShowPage extends Component {
    constructor(params) {
        super(params);

        this.state = {project: {}};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const id = this.props.id;
        this.props.dispatch(ActionTypes.projectsFetchOne(id));
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, updatedProject } = nextProps;
        const project = updatedProject;

        if (project && project.status === STATUS_SUCCESS) {
            dispatch(push(`/projects/${updatedProject.data.id}`));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const project = mergeProjectAndFormState(this.props.project, this.state.project);
        this.props.dispatch(ActionTypes.projectsUpdate(project));
    }

    handleChange(project) {
        this.setState({project});
    }

    render() {
        const { project, updatedProject, currentUser } = this.props;

        let currentUserApiToken = '';
        if (currentUser && currentUser.status === STATUS_SUCCESS) {
            currentUserApiToken = currentUser.data.apiToken;
        }

        const webhookUrl = `${window.env.root_url}/hooks/commit?project_id=${this.props.id}&api_token=${currentUserApiToken}`;

        let error = null;
        if (updatedProject.status === STATUS_FAILURE) {
            error = (
                <div className="alert alert--error">
                    {updatedProject.error}
                </div>
            );
        }

        return (
            <div>
                <ProjectNav
                    projects={[]}
                    project={project}
                    isOnRelatedPage={true}
                />

                <div className="container cf">
                    <div className="row">
                        <div className="six columns">
                            <h1 className="box__header">Settings</h1>
                            <div className="box">
                                <form onSubmit={this.handleSubmit} className="form-fullwidth">
                                    {error}

                                    <ProjectFormFields
                                        project={mergeProjectAndFormState(project, this.state.project)}
                                        onChange={this.handleChange}
                                    />

                                    <button type="submit">
                                        Save
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="six columns">
                            <h1 className="box__header">Git Commit Webhook Setup</h1>
                            <div className="box">
                                <label>Your project's webhook url:</label>
                                <input
                                    type="text"
                                    value={webhookUrl}
                                    readOnly={true}
                                    onClick={(e) => { e.target.select(); }}
                                    style={{width: '100%'}}
                                />

                                <p>
                                    GitHub setup instructions can be found:&nbsp;
                                    <a href="https://github.com/kiasaki/steamy/blob/master/docs/webhook-setup-github.md" target="_blank">here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

function mergeProjectAndFormState(project, projectFormState) {
    return mergeWith((a, b) => {
        if (b === '' && a) {
            return a;
        }
        return b;
    }, project.data || {}, projectFormState);
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.id;
    const project = state.entities.projects[id] || {};
    const updatedProject = state.entities.projects.updated || {};
    const currentUser = state.entities.users.current;

    return {id, currentUser, project, updatedProject};
};

export default connect(mapStateToProps)(ProjectsShowPage);
