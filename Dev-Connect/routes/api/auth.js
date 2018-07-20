const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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
      return res.status(400).json({ email: 'Email already exists!' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      });
      newUser.save((err, user) => {
        res.json(user)
      });
    }
  });
});

module.exports = router;
