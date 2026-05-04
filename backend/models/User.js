const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['USER', 'GARAGE_OWNER', 'ADMIN'],
    default: 'USER'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ],
    select: false // Do not return password by default
  },
  isApproved: {
    type: Boolean,
    default: function() {
      // Admins and regular users are approved by default
      // Garage owners require manual approval
      return this.role !== 'GARAGE_OWNER';
    }
  },
  refreshToken: {
    type: String,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  vehicles: [{
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String }
  }]
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT Access Token
UserSchema.methods.getSignedJwtAccessToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_ACCESS_SECRET || 'mysecretaccesskey123', {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  });
};

// Sign JWT Refresh Token
UserSchema.methods.getSignedJwtRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET || 'mysecretrefreshkey456', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
