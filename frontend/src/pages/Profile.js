import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, calculateCalories } from '../services/api';
import { User, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || 'male',
    height: user?.profile?.height || '',
    weight: user?.profile?.weight || '',
    targetWeight: user?.profile?.targetWeight || '',
    fitnessGoal: user?.profile?.fitnessGoal || 'weight_loss',
    activityLevel: user?.profile?.activityLevel || 'moderate',
    dietPreference: user?.profile?.dietPreference || 'vegetarian',
    healthConditions: user?.profile?.healthConditions || [],
    allergies: user?.profile?.allergies || []
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
    setSuccess(false);

    try {
      const response = await updateProfile({ profile });
      await calculateCalories();
      
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600">Update your health and fitness information</p>
        </div>
      </div>

      <div className="card max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
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
          </div>

          {/* Physical Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Physical Stats</h3>
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
          </div>

          {/* Goals & Preferences */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Goals & Preferences</h3>
            <div className="grid md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">Activity Level</label>
                <select
                  className="input-field"
                  value={profile.activityLevel}
                  onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

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
            </div>
          </div>

          {/* Health Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Health Conditions</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {['pcos', 'diabetes', 'hypertension', 'thyroid', 'none'].map(condition => (
                <label key={condition} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4"
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
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
