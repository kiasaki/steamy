import * as ActionTypes from '../actions';
import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { Link } from 'react-router';
import { STATUS_REQUEST, STATUS_SUCCESS, STATUS_FAILURE, API_UPDATE } from '../lib/api-middleware';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class UsersShowPage extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const id = this.props.id;
        this.props.dispatch(ActionTypes.usersFetchOne(id));
    }

    componentWillUnmount() {
        // Reset updated user for clean state on next user edit
        this.props.dispatch({
            type: API_UPDATE,
            entityType: 'users',
            id: 'updated',
            response: null
        });
    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.updatedUser;

        if (user && user.status === STATUS_SUCCESS) {
            this.props.dispatch(push('/users'));
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const user = this.props.user.data;

        user.email = this.refs.email.value;
        user.password = this.refs.password.value;

        this.props.dispatch(ActionTypes.usersUpdate(user));
    }

    render() {
        const { user, updatedUser } = this.props;
        let content;

        if (!user || user.status === STATUS_REQUEST) {
            content = <div className="text-center">Loading...</div>;
        } else if (user.status === STATUS_FAILURE) {
            content = (
                <div className="text-center color-danger">
                    {user.error}
                </div>
            );
        } else {
            let error = null;

            if (updatedUser && updatedUser.status === STATUS_FAILURE) {
                error = (
                    <div className="alert alert--error">
                        {updatedUser.error}
                    </div>
                );
            }

            content = (
                <form onSubmit={this.handleSubmit}>
                    {error}

                    <label>Email</label>
                    <input type="text" ref="email" defaultValue={user.data.email} autoFocus />

                    <label>Password (optionnal, password won't change if left empty)</label>
                    <input type="password" ref="password" />

                    <button type="submit">
                        Save
                    </button>
                    <Link to="/users">&larr; or go back</Link>
                </form>
            );
        }

        return (
            <div>
                <SimpleNav title="Edit user" />

                <div className="container">
                    <div className="box">
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.params.id;
    const user = state.entities.users[id];
    const updatedUser = state.entities.users.updated;

    return {id, user, updatedUser};
};

export default connect(mapStateToProps)(UsersShowPage);
