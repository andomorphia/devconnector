import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {
  static propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      isAuthenticated: PropTypes.bool,
      user: PropTypes.shape({}),
    }).isRequired,
  };

  handleClick = event => {
    const { logoutUser } = this.props; // eslint-disable-line no-shadow

    event.preventDefault();
    logoutUser();
  };

  render() {
    const { auth } = this.props;
    const { isAuthenticated, user } = auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <button
            className="nav-link avatar-btn"
            type="button"
            onClick={this.handleClick}
          >
            <img
              className="avatar rounded-circle"
              src={user.avatar}
              alt={user.name}
              title="You must have a Gravatar connected to your email to display an image"
            />
            Logout
          </button>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
