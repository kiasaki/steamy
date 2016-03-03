import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

class App extends Component {
    componentDidMount() {
        this.ensureCurrentUser(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.ensureCurrentUser(newProps);
    }

    ensureCurrentUser(props) {
        if (props.authToken && !props.authUser) {
            //props.dispatch(loadCurrentUser());
        }
    }

    render() {
        return (
            <div>
                <header>Header</header>
                {this.props.children}
            </div>
        );
    }
}

export default connect(
    state => {
        const { authToken, authUser } = state;
        return {authToken, authUser};
    },
    {pushState}
)(App);
