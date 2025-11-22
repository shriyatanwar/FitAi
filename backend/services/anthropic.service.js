const Anthropic = require('@anthropic-ai/sdk');

class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.model = 'claude-3-5-haiku-20241022';
  }

  async generateCompletion(messages, temperature = 0.7, maxTokens = 2000) {
    try {
      // Convert messages format from OpenAI to Anthropic
      // Anthropic separates system messages from user/assistant messages
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        temperature: temperature,
        system: systemMessage,
        messages: conversationMessages
      });

      return {
        text: response.content[0].text,
        stopReason: response.stop_reason
      };
    } catch (error) {
      console.error('Anthropic API Error:', error.message);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateWorkoutPlan(userProfile) {
    const { age, gender, weight, fitnessGoal, activityLevel, healthConditions } = userProfile;

    const prompt = `Create a personalized 7-day workout plan for a ${age}-year-old ${gender} who weighs ${weight}kg.

Fitness Goal: ${fitnessGoal}
Activity Level: ${activityLevel}
Health Conditions: ${healthConditions.join(', ') || 'None'}

Provide a detailed workout plan in JSON format with the following structure:
{
  "name": "Plan name",
  "description": "Brief description",
  "duration": "1 week",
  "exercises": [
    {
      "day": "Monday",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "10-12",
          "duration": "30 minutes",
          "restTime": "60 seconds",
          "instructions": "How to perform",
          "muscleGroup": "Target muscle"
        }
      ]
    }
  ]
}

Make it realistic, safe, and effective for their profile.
Return ONLY the JSON object, no markdown formatting, no explanation text, no code blocks.`;

    const messages = [
      { role: 'system', content: 'You are a professional fitness trainer. Return ONLY valid JSON with no markdown formatting, no code blocks, and no additional text.' },
      { role: 'user', content: prompt }
    ];

    const result = await this.generateCompletion(messages, 0.7, 4096);

    // Check if response was truncated
    if (result.stopReason === 'max_tokens') {
      throw new Error('AI response was truncated. The workout plan is too large. Please try again.');
    }

    // Extract and clean JSON from response
    let cleanedResponse = result.text.trim();

    // Remove markdown code blocks (multiple passes to handle nested blocks)
    cleanedResponse = cleanedResponse.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');

    // Try to extract JSON object if there's extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    try {
      const parsedPlan = JSON.parse(cleanedResponse);

      // Validate the structure
      if (!parsedPlan.name || !parsedPlan.exercises || !Array.isArray(parsedPlan.exercises)) {
        throw new Error('Invalid workout plan structure: missing required fields');
      }

      return parsedPlan;
    } catch (error) {
      console.error('Failed to parse workout plan JSON:', error.message);
      console.error('Raw response:', result.text.substring(0, 1000));
      console.error('Cleaned response:', cleanedResponse.substring(0, 1000));
      throw new Error(`AI generated invalid workout plan format: ${error.message}`);
    }
  }

  async generateMealPlan(userProfile) {
    const { targetCalories, dietPreference, healthConditions, allergies } = userProfile;

    const prompt = `Create a personalized 7-day meal plan with the following requirements:

Target Calories: ${targetCalories} per day
Diet Preference: ${dietPreference}
Health Conditions: ${healthConditions.join(', ') || 'None'}
Allergies: ${allergies?.join(', ') || 'None'}

Provide a detailed meal plan in JSON format with the following structure:
{
  "name": "Plan name",
  "description": "Brief description",
  "targetCalories": ${targetCalories},
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal name",
          "ingredients": ["ingredient1", "ingredient2"],
          "calories": 400,
          "protein": 20,
          "carbs": 50,
          "fats": 15,
          "instructions": "How to prepare",
          "prepTime": "15 minutes"
        }
      ]
    }
  ]
}

IMPORTANT:
- The "type" field must be exactly one of: "breakfast", "lunch", "dinner", or "snack" (singular, not "snacks").
- Include 3-4 meals per day. Ensure meals are balanced, nutritious, and appropriate for their health conditions.
- Return ONLY the JSON object, no markdown formatting, no explanation text, no code blocks.`;

    const messages = [
      { role: 'system', content: 'You are a professional nutritionist. Return ONLY valid JSON with no markdown formatting, no code blocks, and no additional text.' },
      { role: 'user', content: prompt }
    ];

    const result = await this.generateCompletion(messages, 0.7, 4096);

    // Check if response was truncated
    if (result.stopReason === 'max_tokens') {
      throw new Error('AI response was truncated. The meal plan is too large. Please try again.');
    }

    // Extract and clean JSON from response
    let cleanedResponse = result.text.trim();

    // Remove markdown code blocks (multiple passes to handle nested blocks)
    cleanedResponse = cleanedResponse.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');

    // Try to extract JSON object if there's extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    try {
      const parsedPlan = JSON.parse(cleanedResponse);

      // Validate the structure
      if (!parsedPlan.name || !parsedPlan.days || !Array.isArray(parsedPlan.days)) {
        throw new Error('Invalid meal plan structure: missing required fields');
      }

      // Validate that each day has meals
      for (const day of parsedPlan.days) {
        if (!day.day || !day.meals || !Array.isArray(day.meals)) {
          throw new Error(`Invalid day structure: ${day.day || 'unknown day'}`);
        }

        // Validate meal types
        for (const meal of day.meals) {
          if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.type)) {
            throw new Error(`Invalid meal type: ${meal.type}. Must be breakfast, lunch, dinner, or snack`);
          }
        }
      }

      return parsedPlan;
    } catch (error) {
      console.error('Failed to parse meal plan JSON:', error.message);
      console.error('Raw response:', result.text.substring(0, 1000));
      console.error('Cleaned response:', cleanedResponse.substring(0, 1000));
      throw new Error(`AI generated invalid meal plan format: ${error.message}`);
    }
  }

  async chatCoach(userMessage, userProfile, conversationHistory = []) {
    const systemPrompt = `You are an AI fitness and nutrition coach. The user has the following profile:
- Age: ${userProfile.age}
- Goal: ${userProfile.fitnessGoal}
- Diet Preference: ${userProfile.dietPreference}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'None'}

Provide personalized, motivating, and actionable advice. Be encouraging and supportive.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const result = await this.generateCompletion(messages, 0.8, 2000);
    return result.text;
  }
}

module.exports = new AnthropicService();
