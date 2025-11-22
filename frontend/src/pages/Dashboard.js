import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProgress, addProgress } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingDown, Target, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      await addProgress({ weight: parseFloat(newWeight), notes });
      setNewWeight('');
      setNotes('');
      setShowAddProgress(false);
      loadProgress();
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const chartData = progress.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    weight: p.weight
  }));

  const currentWeight = progress.length > 0 ? progress[progress.length - 1].weight : user?.profile?.weight;
  const targetWeight = user?.profile?.targetWeight;
  const weightToLose = currentWeight - targetWeight;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600 mt-1">Here's your fitness overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Weight</p>
              <p className="text-3xl font-bold mt-1">{currentWeight || '-'} kg</p>
            </div>
            <Activity className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Target Weight</p>
              <p className="text-3xl font-bold mt-1">{targetWeight || '-'} kg</p>
            </div>
            <Target className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">To Reach Goal</p>
              <p className="text-3xl font-bold mt-1">{weightToLose > 0 ? weightToLose.toFixed(1) : '0'} kg</p>
            </div>
            <TrendingDown className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Daily Calories</p>
              <p className="text-3xl font-bold mt-1">{user?.profile?.targetCalories || '-'}</p>
            </div>
            <Calendar className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weight Progress</h2>
          <button 
            onClick={() => setShowAddProgress(!showAddProgress)}
            className="btn-primary text-sm"
          >
            Log Weight
          </button>
        </div>

        {showAddProgress && (
          <form onSubmit={handleAddProgress} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling?"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button type="submit" className="btn-primary text-sm">Save</button>
              <button 
                type="button" 
                onClick={() => setShowAddProgress(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No progress data yet. Start logging your weight to see the chart!
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Fitness Goal</p>
            <p className="font-medium capitalize">{user?.profile?.fitnessGoal?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <p className="font-medium capitalize">{user?.profile?.activityLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diet Preference</p>
            <p className="font-medium capitalize">{user?.profile?.dietPreference?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Health Conditions</p>
            <p className="font-medium capitalize">
              {user?.profile?.healthConditions?.join(', ') || 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
