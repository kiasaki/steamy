import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as ActionTypes from '../actions';

class DashboardPage extends Component {
    componentDidMount() {
        this.props.dispatch(ActionTypes.fetchCurrentUser());
    }
    render() {
        return <div>Dashboard</div>;
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    };
};

export default connect(mapStateToProps)(DashboardPage);
