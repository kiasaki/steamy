import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';

import * as ActionTypes from '../actions';
import SimpleNav from '../components/simple-nav.jsx';

class ProjectsIndexPage extends Component {
    componentDidMount() {
        this.props.dispatch(ActionTypes.fetchCurrentUser());
    }

    render() {
        return (
            <div>
                <SimpleNav title="Dashboard" />

                <div className="container">
                    <div className="empty-state">
                        <h1>You have no projects yet!</h1>
                        <span>
                            <Link to="/projects/create">Create one!</Link>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    };
};

export default connect(mapStateToProps)(ProjectsIndexPage);
