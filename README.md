# 🏋️ FitAI - AI Personalized Fitness & Diet Dashboard

A full-stack AI-powered fitness and nutrition application that generates personalized workout plans, meal plans, and provides an intelligent AI coach chatbot.

## 📹 Demo Videos

Check out the demo video in the `videos/` folder to see FitAI in action:
- [fitAi-video.mov](videos/fitAi-video.mov) - Complete application walkthrough and feature demonstration

## 🌟 Features

### ✨ Core Features
- **AI Workout Generator**: Personalized workout plans based on your fitness goals, activity level, and health conditions
- **AI Meal Plan Generator**: Custom nutrition plans considering calories, diet preferences (veg/non-veg), and health conditions like PCOS, diabetes, etc.
- **Smart AI Coach Chatbot**: Interactive fitness coach that provides advice, motivation, and answers your questions
- **Progress Tracking**: Log and visualize your weight progress with charts
- **User Profiles**: Comprehensive health profiles with BMR/TDEE calculations

### 🎯 Health Considerations
- PCOS-friendly meal planning
- Diabetes management
- Hypertension considerations
- Thyroid condition awareness
- Allergy tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MongoDB**: Database for user data, workout plans, and meal plans
- **Mongoose**: ODM for MongoDB
- **OpenAI API**: Powers AI workout generation, meal planning, and chatbot
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: Modern UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization for progress tracking
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

## 📁 Project Structure

```
fitness-dashboard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── WorkoutPlan.js
│   │   └── MealPlan.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── workout.js
│   │   ├── meal.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── openai.service.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── ProfileSetup.js
    │   │   ├── Dashboard.js
    │   │   ├── Workout.js
    │   │   ├── MealPlan.js
    │   │   ├── AICoach.js
    │   │   └── Profile.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key

### Installation

#### 1. Clone the repository
```bash
cd fitness-dashboard
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-dashboard
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start MongoDB (if running locally)
```bash
mongod
```

#### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/progress` - Log weight progress
- `GET /api/user/progress` - Get progress history
- `POST /api/user/calculate-calories` - Calculate target calories

### Workout Endpoints
- `POST /api/workout/generate` - Generate AI workout plan
- `GET /api/workout` - Get all workout plans
- `GET /api/workout/:id` - Get specific workout plan
- `DELETE /api/workout/:id` - Delete workout plan

### Meal Plan Endpoints
- `POST /api/meal/generate` - Generate AI meal plan
- `GET /api/meal` - Get all meal plans
- `GET /api/meal/:id` - Get specific meal plan
- `DELETE /api/meal/:id` - Delete meal plan

### Chat Endpoints
- `POST /api/chat` - Send message to AI coach

## 🎨 Features Showcase

### 1. User Registration & Profile Setup
- Create account with email/password
- Complete health profile with:
  - Age, gender, height, weight
  - Fitness goals (weight loss, muscle gain, maintenance)
  - Activity level
  - Diet preferences
  - Health conditions
  - Allergies

### 2. Dashboard
- Overview of current stats
- Weight progress chart
- BMR and TDEE calculations
- Quick access to all features

### 3. AI Workout Generator
- Generates 7-day personalized workout plans
- Includes:
  - Exercise names and instructions
  - Sets, reps, and rest times
  - Target muscle groups
  - Duration estimates

### 4. AI Meal Plan Generator
- Creates balanced 7-day meal plans
- Features:
  - Breakfast, lunch, dinner, and snacks
  - Calorie and macro breakdowns
  - Ingredients and instructions
  - Prep time estimates
  - Diet preference compliance

### 5. AI Fitness Coach
- Real-time chat interface
- Provides:
  - Workout advice
  - Nutrition guidance
  - Motivation and support
  - Answers to fitness questions
- Maintains conversation context

### 6. Progress Tracking
- Log weight entries
- Visual progress charts
- Track journey to goal weight
- Add notes for each entry

## 🔒 Security Features
- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Secure MongoDB queries

## 🎯 Future Enhancements
- Recipe database integration
- Workout video tutorials
- Social features (share plans)
- Mobile app (React Native)
- Integration with fitness trackers
- Advanced analytics and insights
- Meal prep suggestions
- Shopping list generator

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access (for MongoDB Atlas)

### OpenAI API Errors
- Verify API key is correct
- Check API usage limits
- Ensure billing is set up

### Frontend Not Connecting to Backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Check CORS settings in backend

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

### Key Implementation Details
1. **AI Integration**: Uses GPT-3.5-turbo for generating workout and meal plans
2. **Calorie Calculation**: Harris-Benedict equation for BMR + activity multipliers
3. **State Management**: React Context API for authentication
4. **Responsive Design**: Tailwind CSS with mobile-first approach
5. **Data Visualization**: Recharts for progress tracking

### Testing Credentials (Development)
After registering, you can test the app with any email/password combination.

## 🌟 Showcase Features
- Modern, intuitive UI/UX
- Real-time AI responses
- Comprehensive recommendation system
- Health-aware meal planning
- Professional fitness tracking
- Domain-relevant features (PCOS, diabetes, etc.)

---

Built with ❤️ using React, Node.js, MongoDB, and OpenAI
# FitAi
