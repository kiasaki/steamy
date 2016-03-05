import React, { Component } from 'react';
import SimpleNav from '../components/simple-nav.jsx';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as ActionTypes from '../actions';

class ProjectsCreatePage extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Ensure auth
        this.props.dispatch(ActionTypes.fetchCurrentUser());
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <SimpleNav title="New Project" />

                <div className="container">
                    <div className="box">
                        <form onSubmit={this.handleSubmit}>
                            <label>Title</label>
                            <input type="text" ref="title" autoFocus />

                            <button type="submit">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    };
};

export default connect(mapStateToProps)(ProjectsCreatePage);
