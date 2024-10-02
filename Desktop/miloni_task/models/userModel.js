const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
});

// Method to generate JWT tokens
userSchema.methods.generateAuthTokens = async function () {
  const accessToken = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token expiration time
  });
  const refreshToken = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Refresh token expiration time
  });
  
  this.refreshToken = refreshToken; // Store the refresh token
  this.save(); // Save the refresh token in the database

  return { accessToken, refreshToken };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
