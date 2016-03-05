import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class ProjectsShowPage extends Component {
    componentDidMount() {
        const id = this.props.id;
        this.props.dispatch(ActionTypes.projectsFetchOne(id));
    }

    render() {
        const { project } = this.props;

        return (
            <div>
                <SimpleNav title="Projects" />

                <div className="container">
                    <div className="box">
                        {JSON.stringify(project, null, 2)}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.id;
    const project = state.entities.projects[id] || {};

    return { id, project };
};

export default connect(mapStateToProps)(ProjectsShowPage);
