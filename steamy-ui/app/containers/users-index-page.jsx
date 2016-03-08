import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { sortBy, map, filter, reverse, prop, propEq, values } from 'ramda';
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

    render() {
        const { users } = this.props;

        return (
            <div>
                <SimpleNav title="Users" />

                <div className="container">
                    {map(p => (
                        <div key={p.id} className="box project-summary cf">
                            <div className="pull-left project-summary__title" onClick={this.createHandleShow(p.id)}>
                                <i className="fa fa-plus-circle project-summary__title__expand" />
                                <h1>{p.title}</h1>
                                <span>Deployed on 0 servers</span>
                            </div>
                            <div className="pull-right project-summary__settings">
                                <Link to="/">
                                    <i className="fa fa-cog" />
                                </Link>
                            </div>
                            <div className="pull-right project-summary__deployment">
                            </div>
                        </div>
                     ), users)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { entities } = state;
    const userResponses = map(prop('data'), filter(
        propEq('status', STATUS_SUCCESS),
        values(entities.users)
    ));
    const users = reverse(sortBy(prop('updated'), userResponses));

    return {users};
};

export default connect(mapStateToProps)(UsersIndexPage);
