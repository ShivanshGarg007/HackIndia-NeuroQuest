const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { register, login, protect } = require('../controllers/authController');
const validate = require('../middleware/validate');

// Register user
router.post('/register', [
  body('name').trim().not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', protect, (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;