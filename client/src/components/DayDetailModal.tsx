import React, { useState } from 'react';
import { X, Trash2, Plus, Calendar } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { toLocalDateString } from '../utils/date';
import { AddFoodModal } from './AddFoodModal';
import { AddCustomFoodModal } from './AddCustomFoodModal';

interface DayDetailModalProps {
  date: string;
  onClose: () => void;
}

export const DayDetailModal = ({ date, onClose }: DayDetailModalProps) => {
  const { meals, deleteMeal, dailyGoals } = useNutrition();
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [showPlannedTab, setShowPlannedTab] = useState(false);

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const todayStr = toLocalDateString();
  const isPastOrToday = date <= todayStr;

  // Logged meals
  const loggedMeals = meals.filter(meal => meal.date === date && !meal.isPlanned);
  
  // Planned meals
  const plannedMeals = meals.filter(meal => meal.date === date && meal.isPlanned);

  const calculateTotals = (mealList: typeof meals) => {
    return mealList.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories * meal.servings,
        protein: acc.protein + meal.nutrition.protein * meal.servings,
        carbs: acc.carbs + meal.nutrition.carbs * meal.servings,
        fats: acc.fats + meal.nutrition.fats * meal.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const loggedTotals = calculateTotals(loggedMeals);
  const plannedTotals = calculateTotals(plannedMeals);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-300 to-red-400 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-white mb-1">Day Details</h2>
              <p className="text-white text-opacity-90 text-sm">{formattedDate}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPlannedTab(false)}
              className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                !showPlannedTab
                  ? 'bg-white text-red-500'
                  : 'bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30'
              }`}
            >
              {isPastOrToday ? 'Logged Meals' : 'Meals'}
            </button>
            <button
              onClick={() => setShowPlannedTab(true)}
              className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                showPlannedTab
                  ? 'bg-white text-red-500'
                  : 'bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30'
              }`}
            >
              Meal Plan
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showPlannedTab ? (
            <>
              {/* Logged Meals Totals */}
              <div className="bg-red-50 rounded-2xl p-6 mb-6">
                <h3 className="text-gray-800 mb-4">Daily Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(loggedTotals.calories)}</div>
                    <div className="text-gray-600 text-sm">/ {dailyGoals.calories} cal</div>
                    <div className="text-gray-500 text-xs mt-1">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(loggedTotals.protein)}g</div>
                    <div className="text-gray-600 text-sm">/ {dailyGoals.protein}g</div>
                    <div className="text-gray-500 text-xs mt-1">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(loggedTotals.carbs)}g</div>
                    <div className="text-gray-600 text-sm">/ {dailyGoals.carbs}g</div>
                    <div className="text-gray-500 text-xs mt-1">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(loggedTotals.fats)}g</div>
                    <div className="text-gray-600 text-sm">/ {dailyGoals.fats}g</div>
                    <div className="text-gray-500 text-xs mt-1">Fats</div>
                  </div>
                </div>
              </div>

              {/* Logged Meals List */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-800">Meals</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddFoodModal(true)}
                      className="px-4 py-2 bg-gradient-to-br from-red-300 to-red-400 text-white rounded-xl text-sm hover:from-red-400 hover:to-red-500 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Food
                    </button>
                    <button
                      onClick={() => setShowCustomFoodModal(true)}
                      className="px-4 py-2 bg-gradient-to-br from-red-300 to-red-400 text-white rounded-xl text-sm hover:from-red-400 hover:to-red-500 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Custom
                    </button>
                  </div>
                </div>

                {loggedMeals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No meals logged for this day
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loggedMeals.map(meal => (
                      <div
                        key={meal.id}
                        className="bg-gray-50 rounded-xl p-4 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="text-gray-800">{meal.foodName}</div>
                          <div className="text-gray-600 text-sm mt-1">
                            {meal.servings} × {meal.servingSize}
                          </div>
                          <div className="text-gray-600 text-sm mt-2">
                            {Math.round(meal.nutrition.calories * meal.servings)} cal | 
                            P: {Math.round(meal.nutrition.protein * meal.servings)}g | 
                            C: {Math.round(meal.nutrition.carbs * meal.servings)}g | 
                            F: {Math.round(meal.nutrition.fats * meal.servings)}g
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Planned Meals Totals */}
              <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                <h3 className="text-gray-800 mb-4">Planned Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(plannedTotals.calories)}</div>
                    <div className="text-gray-600 text-sm">calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(plannedTotals.protein)}g</div>
                    <div className="text-gray-600 text-sm">protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(plannedTotals.carbs)}g</div>
                    <div className="text-gray-600 text-sm">carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-800 text-2xl">{Math.round(plannedTotals.fats)}g</div>
                    <div className="text-gray-600 text-sm">fats</div>
                  </div>
                </div>
              </div>

              {/* Planned Meals List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-800">Planned Meals</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddFoodModal(true)}
                      className="px-4 py-2 bg-gradient-to-br from-purple-300 to-purple-400 text-white rounded-xl text-sm hover:from-purple-400 hover:to-purple-500 transition-all flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Plan Food
                    </button>
                    <button
                      onClick={() => setShowCustomFoodModal(true)}
                      className="px-4 py-2 bg-gradient-to-br from-purple-300 to-purple-400 text-white rounded-xl text-sm hover:from-purple-400 hover:to-purple-500 transition-all flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Custom
                    </button>
                  </div>
                </div>

                {plannedMeals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No meals planned for this day
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plannedMeals.map(meal => (
                      <div
                        key={meal.id}
                        className="bg-purple-50 rounded-xl p-4 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="text-gray-800">{meal.foodName}</div>
                          <div className="text-gray-600 text-sm mt-1">
                            {meal.servings} × {meal.servingSize}
                          </div>
                          <div className="text-gray-600 text-sm mt-2">
                            {Math.round(meal.nutrition.calories * meal.servings)} cal | 
                            P: {Math.round(meal.nutrition.protein * meal.servings)}g | 
                            C: {Math.round(meal.nutrition.carbs * meal.servings)}g | 
                            F: {Math.round(meal.nutrition.fats * meal.servings)}g
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="text-purple-500 hover:bg-purple-100 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Food Modals */}
      {showAddFoodModal && (
        <AddFoodModal
          onClose={() => setShowAddFoodModal(false)}
          selectedDate={date}
          isPlanned={showPlannedTab}
        />
      )}
      {showCustomFoodModal && (
        <AddCustomFoodModal
          onClose={() => setShowCustomFoodModal(false)}
          selectedDate={date}
          isPlanned={showPlannedTab}
        />
      )}
    </div>
  );
};
