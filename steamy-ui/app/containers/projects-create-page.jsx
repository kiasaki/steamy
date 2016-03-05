import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class ProjectsCreatePage extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Ensure auth
        this.props.dispatch(ActionTypes.fetchCurrentUser());
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

        const title = this.refs.title.value;
        this.props.dispatch(ActionTypes.projectsCreate(title));
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
                        <form onSubmit={this.handleSubmit}>
                            {error}

                            <label>Title</label>
                            <input type="text" ref="title" autoFocus />

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
    return {
        authUser: state.authUser,
        project: state.entities.projects.created || {}
    };
};

export default connect(mapStateToProps)(ProjectsCreatePage);
