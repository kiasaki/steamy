import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { erasePersistedToken } from '../lib/auth';

class SignoutPage extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        erasePersistedToken();
        dispatch(ActionTypes.setAuthToken(null));
        dispatch(ActionTypes.clearCurrentUser());
        dispatch(push('/'));
    }

    render() {
        return <div>Signing out...</div>;
    }
}

export default connect()(SignoutPage);
