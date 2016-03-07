import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SimpleNav extends Component {
    render() {
        return (
            <nav className="page-navigation">
                <div className="container cf">
                    <div className="pull-left">
                        <span className="page-navigation__title">
                            {this.props.title}
                        </span>
                    </div>
                    <div className="pull-right">
                        <Link to="/projects/create">
                            + New Project
                        </Link>
                        <Link to="/users/create">
                            + New User
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}

SimpleNav.propTypes = {
    title: PropTypes.string.isRequired
};

export default SimpleNav;
