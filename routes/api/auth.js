const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { User } = require('../../models/User');
const validate = require('../../middleware/validate');
const express = require('express');
const router = express.Router();

// @route   POST api/auth
// @desc    User login
// @access  Public
router.post('/', validate(validateLogin), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validateLogin(req) {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
