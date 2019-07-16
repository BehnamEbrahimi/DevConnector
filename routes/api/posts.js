const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User } = require('../../models/User');
const { Post, validatePost, validateComment } = require('../../models/Post');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const validateObjectId = require('../../middleware/validateObjectId');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, validate(validatePost)], async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user._id
  });

  const post = await newPost.save();

  res.send(post);
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.send(posts);
});

// @route   GET api/posts/:id
// @desc    Get one post by Id
// @access  Private
router.get('/:id', [auth, validateObjectId], async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).send('Post not found.');
  }

  res.send(post);
});

// @route   DELETE api/posts/:id
// @desc    Delete one post
// @access  Private
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).send('Post not found.');
  }

  // Check user
  if (post.user.toString() !== req.user._id) {
    return res.status(403).send('Forbidden action.');
  }

  await post.remove();

  res.send('Post deleted.');
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', [auth, validateObjectId], async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).send('Post not found.');
  }

  // Check the user already liked
  if (
    post.likes.filter(like => like.user.toString() === req.user._id).length ===
    1
  )
    return res.status(400).send('Already liked.');

  post.likes.unshift({ user: { _id: req.user._id } });
  await post.save();
  res.send(post.likes);
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', [auth, validateObjectId], async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).send('Post not found.');
  }

  // Check the user ever liked
  if (
    post.likes.filter(like => like.user.toString() === req.user._id).length ===
    0
  )
    return res.status(400).send('Post has not yet been liked.');

  const removeIndex = post.likes
    .map(like => like.user.toString())
    .indexOf(req.user._id);
  post.likes.splice(removeIndex, 1);

  await post.save();
  res.send(post.likes);
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, validateObjectId, validate(validateComment)],
  async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found.');
    }

    const user = await User.findById(req.user._id).select('-password');

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id
    };

    post.comments.unshift(newComment);
    await post.save();
    res.send(post.comments);
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment of a post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  [auth, validateObjectId],
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.comment_id))
      return res.status(404).send('Invalid ID.');

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found.');
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).send('Comment not found.');
    }

    // Check the user is who wrote the comment
    if (comment.user.toString() !== req.user._id)
      return res.status(403).send('Forbidden action.');

    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.send(post.comments);
  }
);

module.exports = router;
