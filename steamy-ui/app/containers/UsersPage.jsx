import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

class UsersPage extends Component {
    render() {
        reutrn (
            <div>Users</div>
        );
    }
}

export default connect(
    state => ({q: state.router.location.query.q}),
    {pushState}
)(UsersPage);
