import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

class SignoutPage extends Component {
    componentDidMount() {
        this.props.dispatch(pushState(null, '/'));
    }

    render() {
        return <div>Signing out...</div>;
    }
}

export default connect()(SignoutPage);
