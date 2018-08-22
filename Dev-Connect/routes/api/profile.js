const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load input validators
const validateProfileInput = require('../../validation/profile');

router.get('/test', (req, res) => {
  res.json({ Hello: 'from Profile' });
});

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user!';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route   POST api/profile
// @desc    create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check form validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const {
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body;
    const profileFields = {
      ...req.body,
      user: req.user.id,
      skills: skills.split(','),
      social: { youtube, twitter, facebook, linkedin, instagram }
    };

    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (profile) {
        // profile exists, so update profile
        profileFields.handle = profile.handle;
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
          (err, profile) => {
            res.json(profile);
          }
        );
      } else {
        // check for if the user handle is unique
        Profile.findOne({ handle: profileFields.handle }, (err, profile) => {
          if (profile) {
            errors.handle = 'That user handle already exists';
            return res.status(400).json(errors);
          } else {
            // profile does not exist, create a new one
            new Profile(profileFields).save().then(profile => {
              res.json(profile);
            });
          }
        });
      }
    });
  }
);

module.exports = router;
