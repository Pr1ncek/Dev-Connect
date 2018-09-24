const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const passport = require('passport');

// Load form validatorsq
const validatePostInput = require('../../validation/post');

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (!posts || posts.length == 0) {
        return res
          .status(404)
          .json({ Msg: 'No posts found. Try creating one first!' });
      }
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ Error: err });
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
    console.log(req.body);
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

// @route   POST api/posts/like/:postId
// @desc    Delete a post
// @access  Private
router.post(
  '/like/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { postId } = req.params;

    Post.findById(postId, (err, foundPost) => {
      if (!foundPost || err) {
        res.status(404).json({ Error: err, Message: 'Post not found' });
      }
      const index = foundPost.likes.findIndex(value => {
        return value.user == req.user.id;
      });
      if (index == -1) {
        foundPost.likes.push({ user: req.user.id });
      } else {
        foundPost.likes.splice(index, 1);
      }
      foundPost.save().then(savedPost => {
        res.status(200).json(savedPost);
      });
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

    Post.findOneAndRemove(
      { user: req.user.id, _id: postId },
      (err, response) => {
        if (err || !response) {
          return res
            .status(404)
            .json({ Error: err, Message: 'No post found or unauthorized' });
        }
        res.status(200).json({ Deleted: true });
      }
    );
  }
);

module.exports = router;
