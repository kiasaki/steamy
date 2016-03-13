import * as ActionTypes from '../actions';
import ProjectFormFields from '../components/project-form-fields.jsx';
import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class ProjectsCreatePage extends Component {
    constructor(props) {
        super(props);

        this.state = {project: {}};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { dispatch, currentUser } = this.props;

        // Ensure auth
        if (!currentUser) {
            dispatch(ActionTypes.fetchCurrentUser());
        }
    }

    componentWillReceiveProps(nextProps) {
        const project = nextProps.project;

        if (project.status === STATUS_SUCCESS) {
            const id = project.data.id;
            this.props.dispatch(push(`/projects/${id}`));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.dispatch(ActionTypes.projectsCreate(this.state.project));
    }

    handleChange(project) {
        this.setState({project});
    }

    render() {
        const project = this.props.project;

        let error = null;
        if (project.status === STATUS_FAILURE) {
            error = (
                <div className="alert alert--error">
                    {project.error}
                </div>
            );
        }
        
        return (
            <div>
                <SimpleNav title="New Project" />

                <div className="container">
                    <div className="box">
                        <form onSubmit={this.handleSubmit} className="form-fullwidth">
                            {error}

                            <ProjectFormFields
                                project={this.state.project}
                                onChange={this.handleChange}
                            />

                            <button type="submit">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { authToken, entities } = state;
    const currentUser = entities.users.current;
    const project = entities.projects.created || {};

    return {currentUser, project};
};

export default connect(mapStateToProps)(ProjectsCreatePage);
