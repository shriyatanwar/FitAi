import React, { useState, useEffect } from 'react';
import { generateWorkout, getWorkouts, deleteWorkout } from '../services/api';
import { Dumbbell, Trash2, Sparkles } from 'lucide-react';

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const response = await getWorkouts();
      setWorkouts(response.data);
      if (response.data.length > 0) {
        setSelectedWorkout(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await generateWorkout();
      await loadWorkouts();
      setSelectedWorkout(response.data.workoutPlan);
      alert('✨ AI workout plan generated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate workout plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await deleteWorkout(id);
        loadWorkouts();
        if (selectedWorkout?._id === id) {
          setSelectedWorkout(null);
        }
      } catch (error) {
        alert('Failed to delete workout plan');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Workout Plans</h1>
          <p className="text-gray-600 mt-1">AI-powered personalized workouts</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {generating ? 'Generating...' : 'Generate AI Plan'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Workout List */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Your Plans
          </h3>
          
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : workouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No workout plans yet</p>
              <p className="text-sm text-gray-400">Generate your first AI-powered workout!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workouts.map(workout => (
                <div
                  key={workout._id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedWorkout?._id === workout._id
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-xs text-gray-500">{workout.duration}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(workout._id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workout Details */}
        <div className="md:col-span-2">
          {selectedWorkout ? (
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">{selectedWorkout.name}</h2>
              <p className="text-gray-600 mb-4">{selectedWorkout.description}</p>
              
              <div className="flex gap-4 mb-6">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  {selectedWorkout.duration}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {selectedWorkout.aiGenerated ? '🤖 AI Generated' : 'Custom'}
                </span>
              </div>

              <div className="space-y-6">
                {selectedWorkout.exercises.map((dayPlan, idx) => (
                  <div key={idx} className="border-l-4 border-primary-500 pl-4">
                    <h3 className="text-lg font-semibold mb-3">{dayPlan.day}</h3>
                    <div className="space-y-3">
                      {dayPlan.exercises.map((exercise, exIdx) => (
                        <div key={exIdx} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-primary-700">{exercise.name}</h4>
                            <span className="text-xs bg-primary-100 px-2 py-1 rounded">
                              {exercise.muscleGroup}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            {exercise.sets && <p>Sets: {exercise.sets}</p>}
                            {exercise.reps && <p>Reps: {exercise.reps}</p>}
                            {exercise.duration && <p>Duration: {exercise.duration}</p>}
                            {exercise.restTime && <p>Rest: {exercise.restTime}</p>}
                          </div>
                          {exercise.instructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              💡 {exercise.instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-96">
              <div className="text-center">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a workout plan to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workout;
