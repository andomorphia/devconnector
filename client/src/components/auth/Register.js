import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { registerUser } from '../../actions/authActions';

class Register extends Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      isAuthenticated: PropTypes.bool,
      user: PropTypes.shape({}),
    }).isRequired,
    errors: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  };

  componentDidMount() {
    const { auth, history } = this.props;

    if (auth.isAuthenticated) {
      history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props;

    if (prevProps.errors !== errors) {
      this.updateState({ errors });
    }
  }

  updateState = data => {
    this.setState(data);
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = event => {
    const { registerUser, history } = this.props; // eslint-disable-line no-shadow
    const { name, email, password, password2 } = this.state;

    event.preventDefault();

    const newUser = {
      name,
      email,
      password,
      password2,
    };

    registerUser(newUser, history);
  };

  render() {
    const { name, email, password, password2, errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.name,
                    })}
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.email,
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password,
                    })}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password2,
                    })}
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2}
                    onChange={this.handleChange}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
