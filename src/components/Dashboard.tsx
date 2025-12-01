import React, { useState } from 'react';
import { CircularProgress } from './CircularProgress';
import { AddFoodModal } from './AddFoodModal';
import { AddCustomFoodModal } from './AddCustomFoodModal';
import { useNutrition } from '../context/NutritionContext';
import { Plus, Utensils } from 'lucide-react';

export const Dashboard = () => {
  const { meals, dailyGoals } = useNutrition();
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);

  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];

  // Calculate today's totals
  const todaysMeals = meals.filter(meal => meal.date === today && !meal.isPlanned);
  
  const totals = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.nutrition.calories * meal.servings,
      protein: acc.protein + meal.nutrition.protein * meal.servings,
      carbs: acc.carbs + meal.nutrition.carbs * meal.servings,
      fats: acc.fats + meal.nutrition.fats * meal.servings,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your daily nutrition intake</p>
      </div>

      {/* Nutrition Overview */}
      <div className="bg-gradient-to-br from-red-300 to-red-400 rounded-3xl p-8 mb-8">
        <h2 className="text-white mb-6">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CircularProgress
            value={totals.calories}
            max={dailyGoals.calories}
            label="Calories"
            unit="kcal"
            color="#dc2626"
            size={140}
          />
          <CircularProgress
            value={totals.protein}
            max={dailyGoals.protein}
            label="Protein"
            unit="g"
            color="#dc2626"
            size={140}
          />
          <CircularProgress
            value={totals.carbs}
            max={dailyGoals.carbs}
            label="Carbs"
            unit="g"
            color="#dc2626"
            size={140}
          />
          <CircularProgress
            value={totals.fats}
            max={dailyGoals.fats}
            label="Fats"
            unit="g"
            color="#dc2626"
            size={140}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setShowAddFoodModal(true)}
          className="bg-gradient-to-br from-red-300 to-red-400 text-white p-6 rounded-2xl flex items-center justify-center gap-3 hover:from-red-400 hover:to-red-500 transition-all shadow-lg"
        >
          <Plus size={24} />
          <span>Add Food from Database</span>
        </button>
        <button
          onClick={() => setShowCustomFoodModal(true)}
          className="bg-gradient-to-br from-red-300 to-red-400 text-white p-6 rounded-2xl flex items-center justify-center gap-3 hover:from-red-400 hover:to-red-500 transition-all shadow-lg"
        >
          <Utensils size={24} />
          <span>Add Custom Food</span>
        </button>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-gray-800 mb-4">Today's Meals</h3>
        {todaysMeals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No meals logged yet. Add your first meal!</p>
        ) : (
          <div className="space-y-3">
            {todaysMeals.map(meal => (
              <div
                key={meal.id}
                className="bg-red-50 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <div className="text-gray-800">{meal.foodName}</div>
                  <div className="text-gray-600 text-sm">
                    {meal.servings} × {meal.servingSize}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-700">
                    {Math.round(meal.nutrition.calories * meal.servings)} cal
                  </div>
                  <div className="text-gray-600">
                    P: {Math.round(meal.nutrition.protein * meal.servings)}g | 
                    C: {Math.round(meal.nutrition.carbs * meal.servings)}g | 
                    F: {Math.round(meal.nutrition.fats * meal.servings)}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddFoodModal && (
        <AddFoodModal onClose={() => setShowAddFoodModal(false)} />
      )}
      {showCustomFoodModal && (
        <AddCustomFoodModal onClose={() => setShowCustomFoodModal(false)} />
      )}
    </div>
  );
};
