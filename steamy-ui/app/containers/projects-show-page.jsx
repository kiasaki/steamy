import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import ProjectNav from '../components/project-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pipe, values, map, filter, prop, propEq, uniqBy } from 'ramda';

class ProjectsShowPage extends Component {
    componentDidMount() {
        const id = this.props.id;
        this.props.dispatch(ActionTypes.projectsFetchList());
    }

    render() {
        const { project, projects } = this.props;

        const settingsUrl = `/projects/${project.id}/settings`;
        const newEnvironmentUrl = `/projects/${project.id}/environments/create`;

        return (
            <div>
                <ProjectNav projects={projects} project={project} />

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

    return {id, project, projects};
};

export default connect(mapStateToProps)(ProjectsShowPage);
