const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', postSchema);

// validate user input
function validatePost(post) {
  const schema = {
    text: Joi.string().required()
  };

  return Joi.validate(post, schema);
}

// validate user input
function validateComment(comment) {
  const schema = {
    text: Joi.string().required()
  };

  return Joi.validate(comment, schema);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.validateComment = validateComment;
