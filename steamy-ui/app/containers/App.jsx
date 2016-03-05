import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
                            <a href="/">
                                Dashboard
                            </a>
                            <a href="/projects">
                                Projects
                            </a>
                            <a href="/hosts">
                                Hosts
                            </a>
                            <a href="/users">
                                Users
                            </a>
                        </div>
                        <div className="pull-right">
                            <span>
                                {email}
                            </span>
                            <a href="/signout">
                                Signout
                            </a>
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
