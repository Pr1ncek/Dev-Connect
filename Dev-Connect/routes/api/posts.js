const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const passport = require('passport');

// Load form validators
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/all
// @desc    Get all posts
// @access  Public
router.get('/all', (req, res) => {
  Post.find({}, (err, posts) => {
    if (!posts || err) {
      return res.status(404).json({ Msg: 'No posts found', Err: err });
    }
    res.json(posts);
  });
});

// @route   GET api/posts/:postId
// @desc    Get specific post using the postId
// @access  Public
router.get('/:postId', (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (!post || err) {
      return res.status(404).json({ Msg: 'No post found', Err: err });
    }
    res.json(post);
  });
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(406).json(errors);
    }

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.user.name
    });

    newPost
      .save()
      .then(savedPost => {
        res.json(savedPost);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route   DELETE api/posts
// @desc    Delete a post
// @access  Private
router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { postId } = req.params;
    Post.findByIdAndRemove(postId, (err, response) => {
      if (err) {
        return res.status(404).json(err);
      }
      res.status(200).json({ Deleted: true });
    });
  }
);

module.exports = router;
