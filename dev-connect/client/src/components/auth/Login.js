import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/auth-action';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.loginUser({
      email: this.state.email,
      password: this.state.password
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="login mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnect account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
