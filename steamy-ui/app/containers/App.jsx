import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';

import { fetchCurrentUser } from '../actions';

class App extends Component {
    componentDidMount() {
        this.ensureCurrentUser(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.ensureCurrentUser(newProps);
    }

    ensureCurrentUser(props) {
        // Load user if we have a token and it's missing
        if (props.authToken && !props.currentUser) {
            props.dispatch(fetchCurrentUser());
        }
    }

    render() {
        const { currentUser } = this.props;

        let email;
        if (currentUser) {
            email = currentUser.data.email;
        }

        return (
            <div>
                <header className="page-header">
                    <div className="container cf">
                        <div className="pull-left">
                            <span className="page-header__title">Steamy</span>
                            <Link to="/">
                                Projects
                            </Link>
                            <Link to="/hosts">
                                Hosts
                            </Link>
                            <Link to="/users">
                                Users
                            </Link>
                        </div>
                        <div className="pull-right">
                            <span>
                                {email}
                            </span>
                            <Link to="/signout">
                                Signout
                            </Link>
                        </div>
                    </div>
                </header>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { authToken, entities } = state;
    const currentUser = entities.users.current;

    return {authToken, currentUser};
};

export default connect(mapStateToProps)(App);
