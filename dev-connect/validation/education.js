const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  let { school, degree, fieldofstudy, from } = data;

  school = isEmpty(school) ? '' : school;
  degree = isEmpty(degree) ? '' : degree;
  fieldofstudy = isEmpty(fieldofstudy) ? '' : fieldofstudy;
  from = isEmpty(from) ? '' : from;

  if (validator.isEmpty(school)) {
    errors.school = 'School is required';
  }

  if (validator.isEmpty(degree)) {
    errors.degree = 'Degree is required';
  }

  if (validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }

  if (validator.isEmpty(from)) {
    errors.from = 'From date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
