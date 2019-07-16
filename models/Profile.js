const mongoose = require('mongoose');
const Joi = require('joi');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('Profile', profileSchema);

// validate user input
function validateProfile(profile) {
  const schema = {
    status: Joi.string().required(),
    skills: Joi.string().required(),
    company: Joi.string().allow(''),
    website: Joi.string().allow(''),
    location: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    githubusername: Joi.string().allow(''),
    youtube: Joi.string().allow(''),
    facebook: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    instagram: Joi.string().allow(''),
    linkedin: Joi.string().allow('')
  };

  return Joi.validate(profile, schema);
}

// validate user input
function validateExperience(experience) {
  const schema = {
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().allow(''),
    from: Joi.date().required(),
    to: Joi.date().allow(''),
    current: Joi.boolean(),
    description: Joi.string().allow('')
  };

  return Joi.validate(experience, schema);
}

// validate user input
function validateEducation(education) {
  const schema = {
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().allow(''),
    current: Joi.boolean(),
    description: Joi.string().allow('')
  };

  return Joi.validate(education, schema);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;
exports.validateExperience = validateExperience;
exports.validateEducation = validateEducation;
