const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Meal = require('../models/Meal');
const { generateMealPlan } = require('../utils/openai');

// Generate meal plan
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profile || !user.profile.age || !user.profile.weight) {
      return res.status(400).json({ 
        message: 'Please complete your profile first (age, weight, height, goal, diet preference)' 
      });
    }

    // Generate meal plan using OpenAI
    const plan = await generateMealPlan(user.profile);

    // Save meal plan
    const meal = new Meal({
      userId: user._id,
      plan: plan,
    });

    await meal.save();

    res.json({
      message: 'Meal plan generated successfully',
      plan: plan,
      mealId: meal._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to generate meal plan',
      error: error.message 
    });
  }
});

// Get user's meal plans
router.get('/history', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.userId })
      .sort({ generatedAt: -1 })
      .limit(10);

    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific meal plan
router.get('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!meal) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
