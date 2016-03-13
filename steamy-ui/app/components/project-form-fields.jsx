import React, { Component, PropTypes } from 'react';

class ProjectFormFields extends Component {
    constructor(params) {
        super(params);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.onChange({
            title: this.refs.title.value,
            scriptEnv: this.refs.scriptEnv.value,
            scriptBuild: this.refs.scriptBuild.value,
            scriptDeploy: this.refs.scriptDeploy.value
        });
    }

    componentDidMount() {
        this.handleChange();
    }

    render() {
        const { project } = this.props;

        return (
            <div>
                <label>Title</label>
                <input
                    type="text"
                    ref="title"
                    value={project.title}
                    onChange={this.handleChange}
                />

                <label>Build & Deployment environment variables</label>
                <textarea
                    ref="scriptEnv"
                    value={project.scriptEnv}
                    onChange={this.handleChange}
                    style={{minHeight: '180px'}}
                    placeholder={'X_API_SECREY_KEY=secret  \nNODE_ENV=production'}
                />

                <label>Build script</label>
                <textarea
                    ref="scriptBuild"
                    value={project.scriptBuild}
                    onChange={this.handleChange}
                    style={{minHeight: '220px'}}
                    placeholder={'npm install  \nnpm run build  \nmv dist $BUILD_ARTIFACTS/dist  \nmv app $BUILD_ARTIFACTS/app'}
                />

                <label>Deploy script</label>
                <textarea
                    ref="scriptDeploy"
                    value={project.scriptDeploy}
                    onChange={this.handleChange}
                    style={{minHeight: '220px'}}
                    placeholder={'rm /var/www/project1  \nln -s $BUILD_DIR /var/www/project1  \nservice project1 restart'}
                />
            </div>
        );
    }
}

ProjectFormFields.propTypes = {
    project: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ProjectFormFields;
