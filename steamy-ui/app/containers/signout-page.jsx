import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class SignoutPage extends Component {
    componentDidMount() {
        this.props.dispatch(push('/'));
    }

    render() {
        return <div>Signing out...</div>;
    }
}

export default connect()(SignoutPage);
