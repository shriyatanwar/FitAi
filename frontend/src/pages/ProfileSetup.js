import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, calculateCalories } from '../services/api';

const ProfileSetup = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    targetWeight: '',
    fitnessGoal: 'weight_loss',
    activityLevel: 'moderate',
    dietPreference: 'vegetarian',
    healthConditions: [],
    allergies: []
  });

  const handleHealthConditionChange = (condition) => {
    setProfile(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update profile
      const response = await updateProfile({ profile });
      
      // Calculate target calories
      await calculateCalories();
      
      // Reload user data
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="card">
          <h2 className="text-3xl font-bold text-center mb-2">Complete Your Profile</h2>
          <p className="text-center text-gray-600 mb-8">
            Help us personalize your fitness and nutrition plans
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Age</label>
                <input
                  type="number"
                  className="input-field"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Gender</label>
                <select
                  className="input-field"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  className="input-field"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  className="input-field"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  className="input-field"
                  value={profile.targetWeight}
                  onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fitness Goal</label>
              <select
                className="input-field"
                value={profile.fitnessGoal}
                onChange={(e) => setProfile({ ...profile, fitnessGoal: e.target.value })}
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Activity Level</label>
              <select
                className="input-field"
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
            </div>

            {/* Diet Preference */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Diet Preference</label>
              <select
                className="input-field"
                value={profile.dietPreference}
                onChange={(e) => setProfile({ ...profile, dietPreference: e.target.value })}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
              </select>
            </div>

            {/* Health Conditions */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Health Conditions (if any)</label>
              <div className="space-y-2">
                {['pcos', 'diabetes', 'hypertension', 'thyroid', 'none'].map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={profile.healthConditions.includes(condition)}
                      onChange={() => handleHealthConditionChange(condition)}
                    />
                    <span className="capitalize">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
