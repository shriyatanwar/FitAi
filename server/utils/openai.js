const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateWorkoutPlan = async (userProfile) => {
  const { age, gender, weight, height, activityLevel, goal, healthConditions } = userProfile;

  const prompt = `Generate a personalized 7-day workout plan for:
- Age: ${age}
- Gender: ${gender}
- Weight: ${weight}kg
- Height: ${height}cm
- Activity Level: ${activityLevel}
- Goal: ${goal}
- Health Conditions: ${healthConditions?.join(', ') || 'none'}

Provide a structured workout plan with exercises, sets, reps, and rest days. Format as JSON with the following structure:
{
  "weeklyPlan": [
    {
      "day": 1,
      "focus": "Upper Body",
      "exercises": [
        {"name": "Push-ups", "sets": 3, "reps": "12-15", "rest": "60s"},
        ...
      ],
      "duration": "45 minutes",
      "caloriesBurn": "250-300"
    },
    ...
  ],
  "tips": ["tip1", "tip2", ...],
  "warmup": "description",
  "cooldown": "description"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness trainer. Generate detailed, safe, and effective workout plans in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate workout plan');
  }
};

const generateMealPlan = async (userProfile) => {
  const { age, gender, weight, height, goal, dietPreference, healthConditions, allergies } = userProfile;

  // Calculate BMR and daily calorie needs
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * (activityMultipliers[userProfile.activityLevel] || 1.55);

  let targetCalories = tdee;
  if (goal === 'lose_weight') targetCalories -= 500;
  if (goal === 'gain_weight') targetCalories += 500;
  if (goal === 'build_muscle') targetCalories += 300;

  const prompt = `Generate a personalized 7-day meal plan for:
- Daily Calorie Target: ${Math.round(targetCalories)} calories
- Diet Preference: ${dietPreference}
- Goal: ${goal}
- Health Conditions: ${healthConditions?.join(', ') || 'none'}
- Allergies: ${allergies?.join(', ') || 'none'}

${healthConditions?.includes('pcos') ? 'Focus on low GI foods, high fiber, and balanced macros for PCOS management.' : ''}
${healthConditions?.includes('diabetes') ? 'Focus on low sugar, complex carbs, and balanced meals for diabetes management.' : ''}

Provide a structured meal plan with breakfast, lunch, dinner, and snacks. Format as JSON with the following structure:
{
  "dailyTarget": {
    "calories": ${Math.round(targetCalories)},
    "protein": "calculate g",
    "carbs": "calculate g",
    "fats": "calculate g"
  },
  "weeklyPlan": [
    {
      "day": 1,
      "meals": {
        "breakfast": {"name": "...", "calories": 400, "protein": "20g", "carbs": "50g", "fats": "15g", "recipe": "..."},
        "lunch": {...},
        "dinner": {...},
        "snacks": [...]
      },
      "totalCalories": 2000
    },
    ...
  ],
  "tips": ["tip1", "tip2", ...],
  "hydration": "recommendation"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional nutritionist. Generate detailed, balanced meal plans in JSON format. Consider dietary preferences, health conditions, and allergies.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate meal plan');
  }
};

const chatWithCoach = async (message, userProfile, conversationHistory = []) => {
  const systemMessage = `You are an expert AI fitness and nutrition coach. You help users with:
- Workout advice and form corrections
- Nutrition guidance and meal suggestions
- Motivation and accountability
- Progress tracking insights
- Health and wellness tips

User Profile:
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activityLevel}
- Diet Preference: ${userProfile.dietPreference}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'none'}

Be supportive, knowledgeable, and personalized in your responses.`;

  try {
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from coach');
  }
};

module.exports = {
  generateWorkoutPlan,
  generateMealPlan,
  chatWithCoach,
};
