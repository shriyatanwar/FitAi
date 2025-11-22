# 🚀 Quick Start Guide

## Prerequisites
1. Install Node.js (v16+): https://nodejs.org/
2. Install MongoDB: https://www.mongodb.com/try/download/community
3. Get OpenAI API Key: https://platform.openai.com/api-keys

## Setup (5 minutes)

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/fitness-dashboard
JWT_SECRET=mysecretkey123456
OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 2: Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

The default values in `.env` should work.

### Step 3: Start MongoDB
```bash
# In a new terminal
mongod
```

### Step 4: Start Backend
```bash
# In backend directory
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Step 5: Start Frontend
```bash
# In a new terminal, from frontend directory
cd frontend
npm start
```
Frontend opens: http://localhost:3000

## First Use

1. **Register**: Create a new account
2. **Setup Profile**: Fill in your health information
3. **Generate Plans**: Click "Generate AI Plan" on Workout or Meals page
4. **Chat with Coach**: Ask questions in the AI Coach section
5. **Track Progress**: Log your weight in the Dashboard

## Key Features to Test

✅ **AI Workout Generator**: Personalized 7-day workout plans
✅ **AI Meal Planner**: Custom nutrition with calorie tracking  
✅ **AI Coach Chat**: Real-time fitness advice
✅ **Progress Tracking**: Weight logs with charts
✅ **Profile Management**: Update health info anytime

## Need Help?

- MongoDB not running? Start it with `mongod`
- Port already in use? Change PORT in backend/.env
- OpenAI errors? Check your API key and billing

## Tips

💡 Complete your profile thoroughly for better AI recommendations
💡 The AI considers your health conditions (PCOS, diabetes, etc.)
💡 Chat history is maintained during your session
💡 Progress charts update automatically when you log weight

Enjoy your AI-powered fitness journey! 🏋️‍♀️🥗
