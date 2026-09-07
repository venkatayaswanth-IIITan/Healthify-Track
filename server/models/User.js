const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters long']
  },
  profile: {
    name: { type: String, default: 'Health Tracker User' },
    age: { type: Number, default: 25 },
    gender: { type: String, default: 'Other' },
    weight: { type: Number, default: 70 },
    height: { type: Number, default: 170 },
    goalWeight: { type: Number, default: 65 },
    goalSteps: { type: Number, default: 10000 }
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
