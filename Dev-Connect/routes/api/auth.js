const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load mongoose User model
const User = require('../../models/User');

// Load input validators
const validateRegistrationInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get('/test', (req, res) => {
  res.json({ Hello: 'from Auth' });
});

// @route   GET api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegistrationInput(req.body);

  // Check form validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (!foundUser) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) throw err;
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash
        });
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => {
            res.json(err);
          });
      });
    } else {
      errors.email = 'Email already exists';
      res.status(400).json(errors);
    }
  });
});

// @route   GET api/auth/login
// @desc    Login user and send back JWT
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check form validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (foundUser) {
      bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
        if (isMatch) {
          const payload = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email
          };
          jwt.sign(
            payload,
            keys.jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
              res.json({ msg: 'Login success!', token: 'Bearer ' + token });
            }
          );
        } else {
          errors.password = 'password is incorrect';
          return res.status(400).json(errors);
        }
      });
    } else {
      errors.email = 'Email does not exist. Try signing up first';
      return res.status(400).json(errors);
    }
  });
});

// @route   GET api/auth/current
// @desc    Get current user info
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ CurrentUser: req.user });
  }
);

module.exports = router;
