import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { map } from 'ramda';

class ProjectNav extends Component {
    constructor(params) {
        super(params);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleNewProjectSelected(event.target.value);
    }

    render() {
        const { project, projects } = this.props;

        if (!project.data) {
            return (
                <nav className="page-navigation">
                    <div className="container">
                        <span className="page-navigation__title">
                            Loading...
                        </span>
                    </div>
                </nav>
            );
        }

        const projectsOptions = map(p => (
            <option key={p.id} value={p.id}>
                {p.title}
            </option>
        ), projects);
        
        return (
            <nav className="page-navigation page-navigation--project">
                <div className="container cf">
                    <div className="pull-left">
                        <select onChange={this.handleChange} defaultValue={project.data.id}>
                            {projectsOptions}
                        </select>
                        <Link to={`/projects/${project.id}/settings`}>
                            Project settings
                        </Link>
                    </div>
                    <div className="pull-right">
                        <Link to={`/projects/${project.id}/environment/create`}>
                            + New Environment
                        </Link>
                        <a href="https://github.com/kiasaki/steamy/blob/master/docs/README.md" target="_blank">
                            Help
                        </a>
                    </div>
                </div>
            </nav>
        );
    }
}

ProjectNav.propTypes = {
    project: PropTypes.object,
    projects: PropTypes.array.isRequired,
    handleNewProjectSelected: PropTypes.func.isRequired
};

export default ProjectNav;
