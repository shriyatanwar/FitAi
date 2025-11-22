const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { chatWithCoach } = require('../utils/openai');

// Chat with AI coach
router.post('/', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get response from AI coach
    const response = await chatWithCoach(
      message,
      user.profile || {},
      conversationHistory || []
    );

    res.json({
      message: response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to get response from coach',
      error: error.message 
    });
  }
});

module.exports = router;
