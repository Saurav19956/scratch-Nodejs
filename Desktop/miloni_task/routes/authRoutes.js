const express = require('express');
const { body } = require('express-validator');
const { signUp, login, getProfile, resetPasswordRequest, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Sign-up route with validation
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  signUp
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Profile route (requires authentication)
router.get('/profile', authMiddleware, getProfile);

// Password reset request route
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], resetPasswordRequest);

// Password reset route
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], resetPassword);

module.exports = router;
