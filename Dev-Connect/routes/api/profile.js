const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load input validators
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
        res.status(404).json(err);
      });
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get a users profile by a handle ie api/profile/princek123
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user!';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   GET api/profile/user/:user_id
// @desc    Get a users profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user!';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = 'No profile found for this user';
      errors.err = err;
      res.status(404).json(errors);
    });
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name'])
    .then(profiles => {
      if (!profiles || profiles.length === 0) {
        errors.noprofiles = 'There are no profiles in the database';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      errors.err = err;
      res.status(404).json(errors);
    });
});

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

// @route   POST api/profile/experince
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check form validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (!profile || err) {
        errors.profile = 'No profile can be retrieved';
        errors.err = err;
        return res.status(404).json(errors);
      }
      const newExperience = {
        ...req.body
      };
      profile.experience.unshift(newExperience);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check form validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (!profile || err) {
        errors.profile = 'No profile can be retrieved';
        errors.err = err;
        return res.status(404).json(errors);
      }
      const newEducation = {
        ...req.body
      };
      profile.education.unshift(newEducation);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route   POST api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.experience.remove({ _id: req.params.id });
        profile.save().then(profile => {
          res.json(profile);
        });
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.education.remove({ _id: req.params.id });
        profile.save().then(profile => {
          res.json(profile);
        });
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }, (err, response) => {
      User.findByIdAndRemove(req.user.id, (err, response) => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
