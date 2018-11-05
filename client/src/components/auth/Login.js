import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { loginUser } from '../../actions/authActions';

class Login extends Component {
  static propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      isAuthenticated: PropTypes.bool,
      user: PropTypes.shape({}),
    }).isRequired,
    errors: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  state = {
    email: '',
    password: '',
    errors: {},
  };

  componentDidMount() {
    const { auth, history } = this.props;

    if (auth.isAuthenticated) {
      history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps) {
    const { auth, errors, history } = this.props;

    if (prevProps.auth.isAuthenticated !== auth.isAuthenticated) {
      if (auth.isAuthenticated) {
        history.push('/dashboard');
      }
    }

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
    const { loginUser, history } = this.props; // eslint-disable-line no-shadow
    const { email, password } = this.state;

    event.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    loginUser(userCredentials, history);
  };

  render() {
    const { email, password, errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.handleSubmit}>
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
  { loginUser }
)(withRouter(Login));
