import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import ProjectNav from '../components/project-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pipe, values, map, filter, prop, propEq, uniqBy, sortBy, take } from 'ramda';

class ProjectsShowPage extends Component {
    constructor(params) {
        super(params);

        this.handleNewProjectSelected = this.handleNewProjectSelected.bind(this);
    }

    componentDidMount() {
        const { id } = this.props;

        this.props.dispatch(ActionTypes.projectsFetchList());
        this.props.dispatch(ActionTypes.buildsFetchList({
            limit: 20,
            order: '-created',
            filter: JSON.stringify({
                project_id: id
            })
        }));

        document.body.className = 'is-full-width';
    }

    componentWillUnmount() {
        document.body.className = '';
    }

    handleNewProjectSelected(newProjectId) {
        this.props.dispatch(push(`/projects/${newProjectId}`));
    }

    render() {
        const { project, projects, builds } = this.props;

        const settingsUrl = `/projects/${project.id}/settings`;
        const newEnvironmentUrl = `/projects/${project.id}/environments/create`;

        console.log(builds);

        return (
            <div>
                <ProjectNav
                    projects={projects}
                    project={project}
                    handleNewProjectSelected={this.handleNewProjectSelected}
                />

                <div className="project cf">
                    <div className="project__col">
                        <header className="project__header">
                            Builds
                            <Link to="/" className="pull-right">
                                <i className="fa fa-cog" />
                            </Link>
                        </header>

                        <section className="empty-state">
                            <span>
                                Create your first build by visiting the&nbsp;
                                <Link to={settingsUrl}>Project Settings</Link>
                                &nbsp;and configuring a commit webhook. Then,
                                simply push a new commit and steamy will start a
                                build for it!
                            </span>
                        </section>
                    </div>

                    <div className="project__col">
                        <header className="project__header">
                            Stage
                            <Link to="/" className="pull-right">
                                <i className="fa fa-cog" />
                            </Link>
                        </header>

                        <section className="empty-state">
                            <span>
                                Create you first deployment to this environment
                                by clicking on the "Deploy" button on any build
                                to the left.
                            </span>
                        </section>
                    </div>

                    <div className="project__col">
                        <header className="project__header text-muted">
                            New environment
                        </header>
                        <section className="empty-state">
                            <span>
                                Create a<br/>
                                <strong>
                                    <Link to={newEnvironmentUrl}>
                                        New Environment
                                    </Link>
                                </strong>
                            </span>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.id;
    const project = state.entities.projects[id] || {};

    let extractFilterSortEntities = pipe(
        values,
        filter(propEq('status', STATUS_SUCCESS)),
        map(prop('data')),
        uniqBy(prop('id'))
    );

    const projects = extractFilterSortEntities(state.entities.projects);
    const builds = pipe(
        extractFilterSortEntities,
        filter(propEq('projectId', id)),
        sortBy(prop('created')),
        take(20)
    )(state.entities.builds);

    return {id, project, projects, builds};
};

export default connect(mapStateToProps)(ProjectsShowPage);
