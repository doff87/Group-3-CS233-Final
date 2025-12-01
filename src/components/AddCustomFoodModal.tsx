import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

interface AddCustomFoodModalProps {
  onClose: () => void;
  selectedDate?: string;
  isPlanned?: boolean;
}

export const AddCustomFoodModal = ({ onClose, selectedDate, isPlanned = false }: AddCustomFoodModalProps) => {
  const { addMeal } = useNutrition();
  const [formData, setFormData] = useState({
    name: '',
    servingSize: '',
    servings: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const date = selectedDate || new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.servingSize) {
      alert('Please fill in the food name and serving size');
      return;
    }

    addMeal({
      foodId: `custom-${Date.now()}`,
      foodName: formData.name,
      servingSize: formData.servingSize,
      servings: formData.servings,
      nutrition: {
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fats: formData.fats,
      },
      date,
      isPlanned,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-300 to-red-400 p-6 flex justify-between items-center">
          <h2 className="text-white">Add Custom Food</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Food Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Homemade Pasta"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Serving Size *
              </label>
              <input
                type="text"
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                placeholder="e.g., 1 cup, 100g"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Number of Servings
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-gray-800 mb-4">Nutrition Facts (per serving)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Calories
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>
            </div>

            {/* Total Preview */}
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-gray-700 mb-2">Total Nutrition</div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <div className="text-gray-800">
                    {Math.round(formData.calories * formData.servings)}
                  </div>
                  <div className="text-gray-600">cal</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(formData.protein * formData.servings)}g
                  </div>
                  <div className="text-gray-600">protein</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(formData.carbs * formData.servings)}g
                  </div>
                  <div className="text-gray-600">carbs</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(formData.fats * formData.servings)}g
                  </div>
                  <div className="text-gray-600">fats</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-br from-red-300 to-red-400 text-white rounded-xl hover:from-red-400 hover:to-red-500 transition-all"
            >
              {isPlanned ? 'Add to Meal Plan' : 'Add Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
