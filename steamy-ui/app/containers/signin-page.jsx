import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

class SigninPage extends Component {
    constructor(params) {
        super(params);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log({
            email: this.refs.email.value,
            password: this.refs.password.value,
        });
    }

    render() {
        return (
            <div className="signin">
                <div className="signin__inner">
                    <h1 className="text-center">Steamy</h1>
                    <form onSubmit={this.handleSubmit}>
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

export default connect()(SigninPage);
