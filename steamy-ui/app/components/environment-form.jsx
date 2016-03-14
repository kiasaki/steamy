import React, { Component, PropTypes } from 'react';
import { merge } from 'ramda';
import { STATUS_FAILURE } from '../lib/api-middleware';

class EnvironmentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addEnvScript: false,
            overwriteDeployScript: false,
            environment: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Fire off an initial change event so even if no field change
        // but submit is clicked, we have default values in state
        this.handleChange();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.environment);
    }

    handleChange() {
        this.setState({
            addEnvScript: this.refs.addEnvScript.checked,
            overwriteDeployScript: this.refs.overwriteDeployScript.checked,
            environment: {
                title: this.refs.title.value,
                priority: this.refs.priority.value,
                groups: this.refs.groups.value,
                hosts: this.refs.hosts.value,
                scriptEnv: this.refs.scriptEnv.value,
                scriptDeploy: this.refs.scriptDeploy.value
            }
        });
    }

    render() {
        const { addEnvScript, overwriteDeployScript } = this.state;
        const { submitLabel, environment, savedEnvironment } = this.props;
        const env = merge(environment.data, this.state.environment);

        // Make groups and hosts strings again (when comming from api)
        if (Array.isArray(env.groups)) {
            env.groups = env.groups.join(',')
        }
        if (Array.isArray(env.hosts)) {
            env.hosts = env.hosts.join(',')
        }

        let error = null;
        if (savedEnvironment.status === STATUS_FAILURE) {
            error = (
                <div className="alert alert--error">
                    {savedEnvironment.error}
                </div>
            );
        }

        return (
            <form onSubmit={this.handleSubmit} className="form-fullwidth">
                {error}

                <label>Title</label>
                <input
                    type="text"
                    ref="title"
                    value={env.title}
                    onChange={this.handleChange}
                    placeholder="Production"
                />

                <label>
                    Order
                    <span className="text-muted">
                        &nbsp;(Steamy will sort environments based on this field)
                    </span>
                </label>
                <input
                    type="text"
                    ref="priority"
                    value={env.priority}
                    onChange={this.handleChange}
                    placeholder="1"
                />

                <label>
                    Groups
                    <span className="text-muted">
                        &nbsp;(comma separated list of host groups targeted by this environment's deployments)
                    </span>
                </label>
                <input
                    type="text"
                    ref="groups"
                    value={env.groups}
                    onChange={this.handleChange}
                    placeholder="appx_prod,..."
                />

                <label>
                    Hosts
                    <span className="text-muted">
                        &nbsp;(optionnal; comma separated list of hosts targeted by this environment's deployments)
                    </span>
                </label>
                <input
                    type="text"
                    ref="hosts"
                    value={env.hosts}
                    onChange={this.handleChange}
                    placeholder="useast_appx_web_prod_001,eurwest_appx_web_prod,..."
                />

                <fieldset className="card">
                    <label htmlFor="addEnvScript">
                        <input
                            type="checkbox"
                            ref="addEnvScript"
                            id="addEnvScript"
                            onChange={this.handleChange}
                            style={{margin: 0}}
                        />
                        &nbsp;Add environment variables?
                        <span className="text-muted">&nbsp;(additive to project's environment variables)</span>
                    </label>

                    <div style={{display: addEnvScript ? 'block' : 'none'}}>
                        <label>Deployment environment variables</label>
                        <textarea
                            ref="scriptEnv"
                            value={env.scriptEnv}
                            onChange={this.handleChange}
                            style={{minHeight: '180px'}}
                            placeholder={'X_API_SECREY_KEY=secret  \nNODE_ENV=production'}
                        />
                    </div>
                </fieldset>

                <fieldset className="card">
                    <label htmlFor="overwriteDeployScript">
                        <input
                            type="checkbox"
                            ref="overwriteDeployScript"
                            id="overwriteDeployScript"
                            onChange={this.handleChange}
                            style={{margin: 0}}
                        />
                        &nbsp;Overwrite deploy script?
                        <span className="text-muted">&nbsp;(replaces project's default deploy script)</span>
                    </label>

                    <div style={{display: overwriteDeployScript ? 'block' : 'none'}}>
                        <label>Deploy script</label>
                        <textarea
                            ref="scriptDeploy"
                            value={env.scriptDeploy}
                            onChange={this.handleChange}
                            style={{minHeight: '220px'}}
                            placeholder={'rm /var/www/project1  \nln -s $BUILD_DIR /var/www/project1  \nservice project1 restart'}
                        />
                    </div>
                </fieldset>

                <button type="submit">
                    {submitLabel}
                </button>
            </form>
        );
    }
}

EnvironmentForm.propTypes = {
    environment: PropTypes.object,
    savedEnvironment: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    submitLabel: PropTypes.string.isRequired
};

export default EnvironmentForm;
