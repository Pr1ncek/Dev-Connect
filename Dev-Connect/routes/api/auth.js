const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load User model
const User = require('../../models/User');

// @route   GET api/auth/test
// @desc    Test auth route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Auth Route Works!!' });
});

// @route   GET api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ Error: 'Email already exists! ' + email.toString() });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      });
      newUser.save((err, user) => {
        res.json(user);
      });
    }
  });
});

// @route   GET api/auth/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email in DB
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res
        .status(404)
        .json({ Error: 'User not found. Try signing up first' });
    }
    // Validate the password
    bcrypt.compare(password, user.password, function(err, isMatch) {
      // res == true or false
      if (isMatch) {
        const payload = { id: user._id, name: user.name };
        jwt.sign(payload, keys.jwtSecret, { expiresIn: 3600 }, (err, token) => {
          res.json({ login: 'Successful', token: 'Bearer ' + token });
        });
      } else {
        return res.status(400).json({ Error: 'Incorrect password' });
      }
    });
  });
});

module.exports = router;
