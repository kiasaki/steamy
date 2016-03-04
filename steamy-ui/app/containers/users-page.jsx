import React, { Component } from 'react';
import { connect } from 'react-redux';

class UsersPage extends Component {
    render() {
        return (
            <div>Users</div>
        );
    }
}

export default connect()(UsersPage);
