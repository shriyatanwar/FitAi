const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: Number, // in cm
    weight: Number, // in kg
    targetWeight: Number, // in kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    goal: {
      type: String,
      enum: ['lose_weight', 'gain_weight', 'maintain', 'build_muscle'],
      default: 'maintain',
    },
    dietPreference: {
      type: String,
      enum: ['vegetarian', 'non_vegetarian', 'vegan', 'pescatarian'],
      default: 'non_vegetarian',
    },
    healthConditions: [{
      type: String,
      enum: ['pcos', 'diabetes', 'hypertension', 'thyroid', 'none'],
    }],
    allergies: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
