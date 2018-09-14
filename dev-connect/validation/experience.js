const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  let { title, company, from, location } = data;

  title = isEmpty(title) ? '' : title;
  company = isEmpty(company) ? '' : company;
  from = isEmpty(from) ? '' : from;

  if (validator.isEmpty(title)) {
    errors.title = 'Title is required';
  }

  if (validator.isEmpty(company)) {
    errors.company = 'Company is required';
  }

  if (validator.isEmpty(from)) {
    errors.from = 'From date is required';
  }

  if (validator.isEmpty(location)) {
    errors.location = 'Location is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
