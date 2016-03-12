import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
    sortBy, map, filter, reverse, prop, propEq, values, uniqBy, reject, merge, pipe
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

    createHandleDestroy(originalUser) {
        const { dispatch } = this.props;
        const user = originalUser;

        return () => {
            if (confirm('Are you sure?')) {
                dispatch(ActionTypes.usersUpdate(merge(user, {
                    deleted: true
                })));
                setTimeout(() => {
                    dispatch(ActionTypes.usersFetchList());
                }, 500);
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
                    <a onClick={this.createHandleShow(u.id)}>Edit</a>
                    &nbsp;&nbsp;
                    {users.length > 1 ? (
                        <a onClick={this.createHandleDestroy(u)} className="color-danger">
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

    let extractFilterSortEntities = pipe(
        values,
        filter(propEq('status', STATUS_SUCCESS)),
        map(prop('data')),
        uniqBy(prop('id')),
        reject(prop('deleted')),
        sortBy(prop('email'))
    );
    const users = extractFilterSortEntities(entities.users);
    
    return {users};
};

export default connect(mapStateToProps)(UsersIndexPage);
