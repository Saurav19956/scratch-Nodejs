const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/cryptUtils');
const crypto = require('crypto'); // To generate tokens
const nodemailer = require('nodemailer'); // To send emails

const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const { accessToken, refreshToken } = await user.generateAuthTokens(); // Generate tokens
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = await user.generateAuthTokens(); // Generate tokens
    
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Profile route
const getProfile = (req, res) => {
  res.status(200).json({
    message: 'Profile information',
    user: req.user,
  });
};

const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken; // Save reset token to user (add a field to your user schema)
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send email with the token (you need to set up nodemailer transporter)
    console.log('Email:', process.env.EMAIL);
console.log('Password:', process.env.EMAIL_PASSWORD); // Be cautious with logging passwords

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    host: "smtp.example.com",
    port: 587, 
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

    const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `You requested a password reset. Click <a href="${resetLink}">here</a> to set a new password.`,
    });

    res.status(200).json({ message: 'Reset password link sent to email' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error sending reset link' });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await hashPassword(password); // Hash the new password
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpiration = undefined; // Clear the token expiration
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error resetting password' });
  }
}
module.exports = {
  signUp,
  login,
  getProfile,
  resetPasswordRequest,
  resetPassword,
};
