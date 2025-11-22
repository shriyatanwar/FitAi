const express = require('express');
const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const auth = require('../middleware/auth');
const anthropicService = require('../services/anthropic.service');
const router = express.Router();

// Generate AI workout plan
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user.profile.age || !user.profile.weight || !user.profile.fitnessGoal) {
      return res.status(400).json({ 
        error: 'Please complete your profile first (age, weight, fitness goal)' 
      });
    }

    // Generate workout plan using AI
    const planData = await anthropicService.generateWorkoutPlan(user.profile);
    
    // Save to database
    const workoutPlan = new WorkoutPlan({
      user: req.userId,
      name: planData.name,
      description: planData.description,
      goal: user.profile.fitnessGoal,
      duration: planData.duration,
      exercises: planData.exercises,
      aiGenerated: true,
      generatedAt: new Date()
    });

    await workoutPlan.save();
    
    // Add to user's workout plans
    user.workoutPlans.push(workoutPlan._id);
    await user.save();

    res.json({
      message: 'Workout plan generated successfully',
      workoutPlan
    });
  } catch (error) {
    console.error('Error generating workout:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all workout plans
router.get('/', auth, async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({ user: req.userId })
      .sort({ createdAt: -1 });
    res.json(workoutPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific workout plan
router.get('/:id', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    res.json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workout plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    // Remove from user's workout plans
    await User.findByIdAndUpdate(req.userId, {
      $pull: { workoutPlans: req.params.id }
    });
    
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
