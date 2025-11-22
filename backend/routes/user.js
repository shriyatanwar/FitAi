const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    const user = await User.findById(req.userId);
    
    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile };
    }
    
    if (updates.name) user.name = updates.name;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: await User.findById(req.userId).select('-password')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add progress entry
router.post('/progress', auth, async (req, res) => {
  try {
    const { weight, notes } = req.body;
    
    const user = await User.findById(req.userId);
    
    user.progress.push({
      date: new Date(),
      weight,
      notes
    });
    
    await user.save();
    
    res.json({
      message: 'Progress logged successfully',
      progress: user.progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress history
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('progress');
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate target calories
router.post('/calculate-calories', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { age, gender, height, weight, activityLevel, fitnessGoal } = user.profile;
    
    // Harris-Benedict Equation for BMR
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust based on goal
    let targetCalories;
    switch (fitnessGoal) {
      case 'weight_loss':
        targetCalories = Math.round(tdee - 500);
        break;
      case 'muscle_gain':
        targetCalories = Math.round(tdee + 300);
        break;
      case 'maintenance':
        targetCalories = Math.round(tdee);
        break;
      default:
        targetCalories = Math.round(tdee);
    }
    
    user.profile.targetCalories = targetCalories;
    await user.save();
    
    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
