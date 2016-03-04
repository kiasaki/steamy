import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
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
        if (props.authToken && !props.authUser) {
            props.dispatch(fetchCurrentUser());
        }
    }

    render() {
        return (
            <div>
                <header className="page-header">
                    <div className="container">
                        <div className="row">
                            <div className="six columns">
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
                            <div className="six columns text-right">
                                <a href="/signout">
                                    Signout
                                </a>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { authToken, authUser } = state;
    return {authToken, authUser};
};

export default connect(mapStateToProps)(App);
