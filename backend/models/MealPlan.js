const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
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
  targetCalories: Number,
  days: [{
    day: String,
    meals: [{
      type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
      },
      name: String,
      ingredients: [String],
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number,
      instructions: String,
      prepTime: String
    }]
  }],
  dietType: String,
  healthConditions: [String],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  generatedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
