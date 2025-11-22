const express = require('express');
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');
const auth = require('../middleware/auth');
const anthropicService = require('../services/anthropic.service');
const router = express.Router();

// Generate AI meal plan
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user.profile.targetCalories || !user.profile.dietPreference) {
      return res.status(400).json({ 
        error: 'Please complete your profile first (calories, diet preference)' 
      });
    }

    // Generate meal plan using AI
    const planData = await anthropicService.generateMealPlan(user.profile);
    
    // Save to database
    const mealPlan = new MealPlan({
      user: req.userId,
      name: planData.name,
      description: planData.description,
      targetCalories: planData.targetCalories,
      days: planData.days,
      dietType: user.profile.dietPreference,
      healthConditions: user.profile.healthConditions,
      aiGenerated: true,
      generatedAt: new Date()
    });

    await mealPlan.save();
    
    // Add to user's meal plans
    user.mealPlans.push(mealPlan._id);
    await user.save();

    res.json({
      message: 'Meal plan generated successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all meal plans
router.get('/', auth, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.userId })
      .sort({ createdAt: -1 });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific meal plan
router.get('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete meal plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    // Remove from user's meal plans
    await User.findByIdAndUpdate(req.userId, {
      $pull: { mealPlans: req.params.id }
    });
    
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
