import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
    sortBy, map, filter, reverse, prop, propEq, values, uniqBy
} from 'ramda';
import { STATUS_SUCCESS } from '../lib/api-middleware';

import * as ActionTypes from '../actions';
import SimpleNav from '../components/simple-nav.jsx';

class UsersIndexPage extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(ActionTypes.usersFetchList());
    }

    createHandleShow(id) {
        const userId = id;
        return () => {
            this.props.dispatch(push(`/users/${userId}`));
        };
    }

    createHandleDestroy(id) {
        const userId = id;
        return () => {
            if (confirm('Are you sure?')) {
                this.props.dispatch(push(`/users/${userId}`));
            }
        };
    }

    render() {
        const { users } = this.props;

        const rows = map(u => (
            <tr key={u.id}>
                <td onClick={this.createHandleShow(u.id)}>
                    {u.email}
                </td>
                <td className="text-right">
                    <Link to={`/users/${u.id}`}>Edit</Link>
                    &nbsp;&nbsp;
                    {users.length > 1 ? (
                        <a href="#" onClick={this.createHandleDestroy(u.id)} className="color-danger">
                            Delete
                        </a>
                    ) : null}
                </td>
            </tr>
        ), users);

        return (
            <div>
                <SimpleNav title="Users" />

                <div className="container">
                    <table className="box box--table">
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { entities } = state;
    const userResponses = uniqBy(prop('id'), map(prop('data'), filter(
        propEq('status', STATUS_SUCCESS),
        values(entities.users)
    )));
    const users = reverse(sortBy(prop('updated'), userResponses));

    return {users};
};

export default connect(mapStateToProps)(UsersIndexPage);
