const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  let { email, password } = data;

  email = isEmpty(email) ? '' : email;
  password = isEmpty(password) ? '' : password;

  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  }

  if (!validator.isEmail(email)) {
    errors.email = 'Invalid email';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
