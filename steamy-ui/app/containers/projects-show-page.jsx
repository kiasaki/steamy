import * as ActionTypes from '../actions';
import ProjectNav from '../components/project-nav.jsx';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { pipe, values, map, filter, prop, propEq, uniqBy, sortBy, take, reverse } from 'ramda';
import { push } from 'react-router-redux';

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
        const { id, project, projects } = this.props;

        const newEnvironmentUrl = `/projects/${id}/environments/create`;

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
                        </header>

                        {this.renderBuilds()}
                    </div>

                    {this.renderEnvironments()}

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

    renderBuilds() {
        const { id, builds } = this.props;

        const settingsUrl = `/projects/${id}/settings`;

        if (builds.length === 0) {
            return (
                <section className="empty-state">
                    <span>
                        Create your first build by visiting the&nbsp;
                        <Link to={settingsUrl}>Project Settings</Link>
                        &nbsp;and configuring a commit webhook. Then,
                        simply push a new commit and steamy will start a
                        build for it!
                    </span>
                </section>
            );
        }

        return map(build => (
            <article className="card card--with-status card--with-header card--with-quick-actions" key={build.id}>
                <div className={'card__status card__status--' + build.status} />

                <div className="card__header">
                    {build.version} [{build.status}]
                </div>

                <div className="card__quick-actions">
                    <a className="card__quick-actions__action card__quick-actions__action--3" title="Details">
                        <i className="fa fa-info" />
                    </a>
                    <a className="card__quick-actions__action card__quick-actions__action--3" title="Deploy">
                        <i className="fa fa-arrow-right" />
                    </a>
                    <a className="card__quick-actions__action card__quick-actions__action--3" title="Delete">
                        <i className="fa fa-ban" />
                    </a>
                </div>

                <div className="card__attribute" style={{fontFamily: '"Courier New", Courier, monospace'}}>
                    <i className="fa fa-dot-circle-o" title="Commit" />
                    {build.repoCommit.slice(0, 7)}
                </div>
                <div className="card__attribute">
                    <i className="fa fa-code-fork" title="Branch" />
                    {build.repoBranch}
                </div>
                <div className="card__attribute">
                    <i className="fa fa-calendar-o" title="Creation time" />
                    {moment(build.created).fromNow()}
                </div>
                <div className="card__attribute">
                    <i className="fa fa-user" title="Publisher" />
                    {build.publisher}
                </div>
            </article>
        ), builds);
    }

    renderEnvironments() {
        return null;

        return (
            <div className="project__col">
                <header className="project__header">
                    Stage
                    <Link to="/" className="pull-right" title="Settings">
                        <i className="fa fa-cog" />
                    </Link>
                </header>

                {this.renderEnvironment()}
            </div>
        );
    }

    renderEnvironment(environment) {
        return (
            <section className="empty-state">
                <span>
                    Create you first deployment to this environment
                    by clicking on the "Deploy" button on any build
                    to the left.
                </span>
            </section>
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
        reverse,
        take(20)
    )(state.entities.builds);

    return {id, project, projects, builds};
};

export default connect(mapStateToProps)(ProjectsShowPage);
