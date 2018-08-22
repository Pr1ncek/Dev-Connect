const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegistrationInput(data) {
  let errors = {};

  let { name, email, password, confirmedPassword } = data;

  name = isEmpty(name) ? '' : name;
  email = isEmpty(email) ? '' : email;
  password = isEmpty(password) ? '' : password;
  confirmedPassword = isEmpty(confirmedPassword) ? '' : confirmedPassword;

  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(name)) {
    errors.name = 'Name is required';
  }

  if (!validator.isEmail(email)) {
    errors.email = 'Invalid email';
  }

  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  }

  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'password must be between 6 and 30 characters';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  }

  if (!validator.equals(password, confirmedPassword)) {
    errors.confirmedPassword = 'passwords do not match';
  }

  if (validator.isEmpty(confirmedPassword)) {
    errors.confirmedPassword = 'please confirm password';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
