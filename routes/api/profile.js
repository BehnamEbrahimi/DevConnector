const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const {
  Profile,
  validateProfile,
  validateExperience,
  validateEducation
} = require('../../models/Profile');
const { User } = require('../../models/User');
const { Post } = require('../../models/Post');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const validateObjectId = require('../../middleware/validateObjectId');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate(
    'user',
    ['name', 'avatar']
  );
  if (!profile) {
    return res.status(404).send('Profile not found.');
  }

  res.send(profile);
});

// @route   POST api/profile
// @desc    Create or update profile
// @access  Private
router.post('/', [auth, validate(validateProfile)], async (req, res) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // map user input to profile schema
  const profileFields = {};
  profileFields.user = req.user._id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills)
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  let profile = await Profile.findOne({ user: req.user._id });

  // Update
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    return res.send(profile);
  }

  // Create
  profile = new Profile(profileFields);
  await profile.save();
  res.send(profile);
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);
  res.send(profiles);
});

// @route   GET api/profile/user/:id
// @desc    Get profile by user Id
// @access  Public
router.get('/user/:id', validateObjectId, async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    return res.status(404).send('Profile not found.');
  }

  res.send(profile);
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  // remove posts
  await Post.deleteMany({ user: req.user._id });

  // remove profile
  await Profile.findOneAndRemove({ user: req.user._id });

  // remove user
  await User.findOneAndRemove({ _id: req.user._id });

  res.send('User deleted.');
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [auth, validate(validateExperience)],
  async (req, res) => {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).send('Profile not found.');
    }

    profile.experience.unshift(newExperience); // unshift is like push but adds at the beginning
    await profile.save();

    res.send(profile);
  }
);

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:id', [auth, validateObjectId], async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  // get remove index
  const removeIndex = profile.experience
    .map(item => item._id)
    .indexOf(req.params.id);

  profile.experience.splice(removeIndex, 1);

  await profile.save();

  res.send(profile);
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  '/education',
  [auth, validate(validateEducation)],
  async (req, res) => {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).send('Profile not found.');
    }

    profile.education.unshift(newEducation); // unshift is like push but adds at the beginning
    await profile.save();

    res.send(profile);
  }
);

// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:id', [auth, validateObjectId], async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  // get remove index
  const removeIndex = profile.education
    .map(item => item._id)
    .indexOf(req.params.id);

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.send(profile);
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
  const uri = `https://api.github.com/users/${
    req.params.username
  }/repos?per_page=5&sort=created:asc&client_id=${config.get(
    'githubClientId'
  )}&client_secret=${config.get('githubSecret')}`;

  try {
    const { data: repos } = await axios.get(uri);
    res.send(repos);
  } catch (ex) {
    res.status(404).send('Github profile not found.');
  }
});

module.exports = router;
