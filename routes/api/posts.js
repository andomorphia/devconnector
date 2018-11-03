const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load input validation
const validatePostInput = require('./../../validation/post');

// Load models
const Post = require('./../../models/Post');
const Profile = require('./../../models/Profile');

// @route   GET api/posts/test
// @desc    Test posts route
// @access  Public
router.get('/test', (req, res) => res.json({ message: 'Posts works!' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(() =>
      res.status(404).json({ noPostsFound: 'No posts found with that Id' })
    );
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Public
router.get('/:post_id', (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => res.json(post))
    .catch(() =>
      res.status(404).json({ noPostFound: 'No post found with that Id' })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.user.name,
      avatar: req.user.avatar,
      user: req.user.id,
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:post_id
// @desc    Delete post by id
// @access  Private
router.delete(
  '/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findOneAndDelete({ user: req.user.id, _id: req.params.post_id })
      .then(res.json({ success: true }))
      .catch(() => res.status(404).json({ noPostFound: 'Post not found' }));
  }
);

// @route   POST api/posts/like/:post_id
// @desc    Like post
// @access  Private
router.post(
  '/like/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        const index = post.likes.findIndex(
          like => like.user.toString() === req.user.id
        );

        if (index === -1) {
          post.likes.unshift({ user: req.user.id });
        } else {
          post.likes.splice(index, 1);
        }

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(() => res.status(404).json({ noPostFound: 'Post not found' }));
  }
);

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.user.name,
          avatar: req.user.avatar,
          user: req.user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(() => res.status(404).json({ noPostFound: 'Post not found' }));
  }
);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  '/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // Check if comment exists
        const index = post.comments.findIndex(
          comment => comment._id.toString() === req.params.comment_id
        );

        if (index === -1) {
          return res
            .status(404)
            .json({ commentNotFound: 'Comment does not exist' });
        }

        // Make sure only the comment owner can delete comment
        if (req.user.id !== post.comments[index].user.toString()) {
          return res.status(401).json({ notAuthorized: 'User not authorized' });
        }

        // Delete comment
        post.comments.splice(index, 1);

        // Save post
        post.save().then(post => res.json(post));
      })
      .catch(() => res.status(404).json({ noPostFound: 'Post not found' }));
  }
);

module.exports = router;
