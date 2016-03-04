import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import { STATUS_REQUEST, STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { setPersistedToken } from '../lib/auth';

class SigninPage extends Component {
    constructor(params) {
        super(params);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch } = nextProps;
        const { status, data } = (nextProps.token || {});

        if (status === STATUS_SUCCESS) {
            setPersistedToken(data.token);
            dispatch(ActionTypes.setAuthToken(data.token));
            dispatch(push('/'));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;

        this.props.dispatch(ActionTypes.tokensCreate(
            email, password
        ));
    }

    render() {
        const { status, error } = (this.props.token || {});

        return (
            <div className="signin">
                <div className="signin__inner">
                    <h1 className="text-center">Steamy</h1>
                    <form onSubmit={this.handleSubmit}>
                        {status === STATUS_FAILURE ? (
                             <div className="alert alert--error">
                                 {error}
                             </div>
                        ) : null}
                        
                        <label>Email</label>
                        <input type="text" ref="email" />

                        <label>Password</label>
                        <input type="password" ref="password" />

                        <button type="submit"> 
                            Signin
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const token = state.entities.tokens.login;
    return {token};
};

export default connect(mapStateToProps)(SigninPage);
