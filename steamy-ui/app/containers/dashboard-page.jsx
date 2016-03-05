import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as ActionTypes from '../actions';

class DashboardPage extends Component {
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
                        <span><a href="/projects/create">Create one!</a></span>
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

export default connect(mapStateToProps)(DashboardPage);
