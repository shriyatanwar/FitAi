import React, { useState, useEffect } from 'react';
import { generateMealPlan, getMealPlans, deleteMealPlan } from '../services/api';
import { UtensilsCrossed, Trash2, Sparkles } from 'lucide-react';

const MealPlan = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    setLoading(true);
    try {
      const response = await getMealPlans();
      setMealPlans(response.data);
      if (response.data.length > 0) {
        setSelectedPlan(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await generateMealPlan();
      await loadMealPlans();
      setSelectedPlan(response.data.mealPlan);
      alert('✨ AI meal plan generated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await deleteMealPlan(id);
        loadMealPlans();
        if (selectedPlan?._id === id) {
          setSelectedPlan(null);
        }
      } catch (error) {
        alert('Failed to delete meal plan');
      }
    }
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🍱',
      dinner: '🍽️',
      snack: '🍎'
    };
    return icons[type] || '🍴';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meal Plans</h1>
          <p className="text-gray-600 mt-1">AI-powered nutrition plans</p>
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
        {/* Meal Plan List */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Your Plans
          </h3>
          
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : mealPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No meal plans yet</p>
              <p className="text-sm text-gray-400">Generate your first AI-powered meal plan!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mealPlans.map(plan => (
                <div
                  key={plan._id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedPlan?._id === plan._id
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-xs text-gray-500">{plan.targetCalories} cal/day</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(plan._id);
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

        {/* Meal Plan Details */}
        <div className="md:col-span-2">
          {selectedPlan ? (
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">{selectedPlan.name}</h2>
              <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
              
              <div className="flex gap-4 mb-6">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  🎯 {selectedPlan.targetCalories} cal/day
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                  {selectedPlan.dietType}
                </span>
                {selectedPlan.aiGenerated && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    🤖 AI Generated
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {selectedPlan.days.map((dayPlan, idx) => (
                  <div key={idx} className="border-l-4 border-primary-500 pl-4">
                    <h3 className="text-lg font-semibold mb-3">{dayPlan.day}</h3>
                    <div className="space-y-3">
                      {dayPlan.meals.map((meal, mealIdx) => (
                        <div key={mealIdx} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getMealIcon(meal.type)}</span>
                              <div>
                                <h4 className="font-medium text-primary-700">{meal.name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{meal.type}</p>
                              </div>
                            </div>
                            {meal.prepTime && (
                              <span className="text-xs bg-primary-100 px-2 py-1 rounded">
                                ⏱️ {meal.prepTime}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 my-3 text-center">
                            <div className="bg-white p-2 rounded">
                              <p className="text-xs text-gray-500">Calories</p>
                              <p className="font-semibold text-sm">{meal.calories}</p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <p className="text-xs text-gray-500">Protein</p>
                              <p className="font-semibold text-sm">{meal.protein}g</p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <p className="text-xs text-gray-500">Carbs</p>
                              <p className="font-semibold text-sm">{meal.carbs}g</p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <p className="text-xs text-gray-500">Fats</p>
                              <p className="font-semibold text-sm">{meal.fats}g</p>
                            </div>
                          </div>

                          {meal.ingredients && meal.ingredients.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm font-medium mb-1">Ingredients:</p>
                              <p className="text-sm text-gray-600">
                                {meal.ingredients.join(', ')}
                              </p>
                            </div>
                          )}

                          {meal.instructions && (
                            <div>
                              <p className="text-sm font-medium mb-1">Instructions:</p>
                              <p className="text-sm text-gray-600">{meal.instructions}</p>
                            </div>
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
                <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a meal plan to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
