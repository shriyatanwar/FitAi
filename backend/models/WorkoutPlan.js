const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  goal: String,
  duration: String, // e.g., "4 weeks"
  exercises: [{
    day: String,
    exercises: [{
      name: String,
      sets: Number,
      reps: String,
      duration: String,
      restTime: String,
      instructions: String,
      muscleGroup: String
    }]
  }],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  generatedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
