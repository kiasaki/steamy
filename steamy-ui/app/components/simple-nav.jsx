import React, { Component, PropTypes } from 'react';

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
                        <a href="/projects/create">
                            + New Project
                        </a>
                        <a href="/users/create">
                            + New User
                        </a>
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
