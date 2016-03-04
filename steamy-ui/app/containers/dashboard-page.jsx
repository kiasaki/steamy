import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';

class DashboardPage extends Component {
    componentDidMount() {
        if (!this.props.authUser) {
            this.props.dispatch(push('/signin'));
        }
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
