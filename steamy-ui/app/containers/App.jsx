import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

class App extends Component {
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // handle auth & redirect
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
