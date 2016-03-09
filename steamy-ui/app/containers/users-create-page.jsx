import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { STATUS_SUCCESS, STATUS_FAILURE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class UsersCreatePage extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch, currentUser } = this.props;

        // Ensure auth
        if (!currentUser) {
            dispatch(ActionTypes.fetchCurrentUser());
        }
    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.user;

        if (user.status === STATUS_SUCCESS) {
            this.props.dispatch(push('/users'));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;
        this.props.dispatch(ActionTypes.usersCreate(email, password));
    }

    render() {
        const user = this.props.user;
        let error = null;

        if (user.status === STATUS_FAILURE) {
            error = (
                <div className="alert alert--error">
                    {user.error}
                </div>
            );
        }
        
        return (
            <div>
                <SimpleNav title="New User" />

                <div className="container">
                    <div className="box">
                        <form onSubmit={this.handleSubmit}>
                            {error}

                            <label>Email</label>
                            <input type="text" ref="email" autoFocus />

                            <label>Password</label>
                            <input type="password" ref="password" />

                            <button type="submit">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { entities } = state;
    const currentUser = entities.users.current;
    const user = entities.users.created || {};

    return {currentUser, user};
};

export default connect(mapStateToProps)(UsersCreatePage);
