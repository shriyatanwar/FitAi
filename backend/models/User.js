const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: Number, // in cm
    weight: Number, // in kg
    targetWeight: Number,
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
    },
    dietPreference: {
      type: String,
      enum: ['vegetarian', 'non_vegetarian', 'vegan', 'pescatarian']
    },
    healthConditions: [{
      type: String,
      enum: ['pcos', 'diabetes', 'hypertension', 'thyroid', 'none']
    }],
    allergies: [String],
    targetCalories: Number
  },
  workoutPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  }],
  mealPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
  }],
  progress: [{
    date: Date,
    weight: Number,
    notes: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
