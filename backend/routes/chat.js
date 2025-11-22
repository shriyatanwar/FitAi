const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const anthropicService = require('../services/anthropic.service');
const router = express.Router();

// Chat with AI coach
router.post('/', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const user = await User.findById(req.userId).select('-password');
    
    // Generate AI response
    const aiResponse = await anthropicService.chatCoach(
      message,
      user.profile,
      conversationHistory || []
    );

    res.json({
      message: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
