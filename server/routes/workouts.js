const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Workout = require('../models/Workout');
const { generateWorkoutPlan } = require('../utils/openai');

// Generate workout plan
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profile || !user.profile.age || !user.profile.weight) {
      return res.status(400).json({ 
        message: 'Please complete your profile first (age, weight, height, goal)' 
      });
    }

    // Generate workout plan using OpenAI
    const plan = await generateWorkoutPlan(user.profile);

    // Save workout plan
    const workout = new Workout({
      userId: user._id,
      plan: plan,
    });

    await workout.save();

    res.json({
      message: 'Workout plan generated successfully',
      plan: plan,
      workoutId: workout._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to generate workout plan',
      error: error.message 
    });
  }
});

// Get user's workout plans
router.get('/history', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId })
      .sort({ generatedAt: -1 })
      .limit(10);

    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific workout plan
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
