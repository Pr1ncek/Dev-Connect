const express = require('express');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const commentValidator = require('../../validation/post');

// @route   POST api/comments/:postId
// @desc    Create a comment on a post
// @access  Private
router.post(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = commentValidator(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    const { text } = req.body;
    const { postId } = req.params;

    let profileHandle;
    Profile.findOne({ user: req.user.id })
      .then(response => {
        profileHandle = response.handle;
        const newComment = {
          text: text,
          name: req.user.name,
          user: req.user.id,
          profileHandle: profileHandle
        };
        Post.findById(postId, (err, foundPost) => {
          if (!foundPost || err) {
            return res
              .status(404)
              .json({ Error: err, Message: 'Post not found' });
          }
          foundPost.comments.push(newComment);
          foundPost.save().then(savedPost => {
            res.status(200).json(savedPost);
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
);

// @route   DELETE api/comments/:postId/:commentId
// @desc    Delete a comment on a post
// @access  Private
router.delete(
  '/:postId/:commentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { postId, commentId } = req.params;
    Post.findById(postId, (err, foundPost) => {
      if (!foundPost || err) {
        return res
          .status(404)
          .json({ Error: err, Message: 'Comment not found' });
      }

      const index = foundPost.comments.findIndex(value => {
        return value.user == req.user.id && value._id == commentId;
      });

      if (index == -1) {
        return res
          .status(404)
          .json({ Message: 'Comment not found or Unauthorized' });
      } else {
        foundPost.comments.splice(index, 1);
        foundPost.save().then(savedPost => {
          res.status(200).json(savedPost);
        });
      }
    });
  }
);

module.exports = router;
