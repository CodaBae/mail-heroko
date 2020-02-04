const mongoose = require('mongoose');
const {User} = require('./User')

// Create Schema
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  status: {
    type: String,
  },
  skills: {
    type: [String],
    required: true
  },
  social: {
    twitter: {
      type: String,
    },

    linkedin: {
      type: String,
    },
    facebook: {
      type: String,
    },
    website: {
      type: String,
    },
  },

  userInfo: {
    type: String,
  },
  location: {
    type: String,
  },
  number: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Profile = mongoose.model('profile', ProfileSchema);
module.exports.Profile = Profile
