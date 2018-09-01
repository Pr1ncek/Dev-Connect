const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  let { text } = data;

  text = isEmpty(text) ? '' : text;

  if (!validator.isLength(text, { min: 10, max: 500 })) {
    errors.text = 'Post must be between 10 - 500 characters';
  }
  if (validator.isEmpty(text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
