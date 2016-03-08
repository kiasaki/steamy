import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { sortBy, map, filter, reverse, prop, propEq, values } from 'ramda';
import { STATUS_SUCCESS } from '../lib/api-middleware';

import * as ActionTypes from '../actions';
import SimpleNav from '../components/simple-nav.jsx';

class HostsIndexPage extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(ActionTypes.hostsFetchList());
    }

    createHandleShow(id) {
        const hostId = id;
        return () => {
            this.props.dispatch(push(`/hosts/${hostId}`));
        };
    }

    render() {
        const { hosts } = this.props;
        let content;

        if (hosts.length === 0) {
            content = (
                <div className="empty-state">
                    <h1>You have no hosts yet!</h1>
                    <span>
                        <a href="#">How are hosts added?</a>
                    </span>
                </div>
            );
        } else {
            content = (
                <div>
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
                     ), hosts)}
                </div>
            );
        }

        return (
            <div>
                <SimpleNav title="Hosts" />

                <div className="container">
                    {content}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { entities } = state;
    const hostResponses = map(prop('data'), filter(
        propEq('status', STATUS_SUCCESS),
        values(entities.hosts)
    ));
    const hosts = reverse(sortBy(prop('updated'), hostResponses));

    return {hosts};
};

export default connect(mapStateToProps)(HostsIndexPage);
