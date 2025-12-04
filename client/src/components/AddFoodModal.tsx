import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { searchFoods } from '../utils/foodApi';
import { Food } from '../types';
import { useNutrition } from '../context/NutritionContext';

interface AddFoodModalProps {
  onClose: () => void;
  selectedDate?: string;
  isPlanned?: boolean;
}

export const AddFoodModal = ({ onClose, selectedDate, isPlanned = false }: AddFoodModalProps) => {
  const { addMeal } = useNutrition();
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const date = selectedDate || new Date().toISOString().split('T')[0];

  const loadFoods = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a food name to search the USDA database.');
      setFoods([]);
      setSelectedFood(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchFoods(trimmed);
      setFoods(results);
      if (!results.length) {
        setSelectedFood(null);
        setError('No foods matched that search.');
      }
    } catch (err) {
      console.error('Error loading foods:', err);
      setFoods([]);
      setSelectedFood(null);
      const message = err instanceof Error ? err.message : 'Unable to fetch foods right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadFoods(searchQuery);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;
    // Create meal on server and close modal on success
    addMeal({
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servingSize: selectedFood.servingSize,
      servings,
      nutrition: selectedFood.nutrition,
      date,
      isPlanned,
    }).then(() => onClose()).catch(err => {
      console.error('Failed to add meal', err);
      setError(err instanceof Error ? err.message : String(err));
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-300 to-red-400 p-6 flex justify-between items-center">
          <h2 className="text-white">Add Food from Database</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for foods..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-br from-red-300 to-red-400 text-white rounded-xl hover:from-red-400 hover:to-red-500 transition-all"
            >
              Search
            </button>
          </form>
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Food List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-red-400" size={32} />
            </div>
          ) : foods.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {hasSearched ? 'Adjust your search and try again.' : 'Search for a food name to pull live nutrition data.'}
            </div>
          ) : (
            <div className="space-y-2">
              {foods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedFood?.id === food.id
                      ? 'bg-red-100 border-2 border-red-400'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="text-gray-800">{food.name}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {food.servingSize} - {food.nutrition.calories} cal, P: {food.nutrition.protein}g, C: {food.nutrition.carbs}g, F: {food.nutrition.fats}g
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Food Actions */}
        {selectedFood && (
          <div className="border-t p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Number of Servings
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={servings}
                onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="text-gray-700 mb-2">Total Nutrition</div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-gray-800">
                    {Math.round(selectedFood.nutrition.calories * servings)}
                  </div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(selectedFood.nutrition.protein * servings)}g
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(selectedFood.nutrition.carbs * servings)}g
                  </div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div>
                  <div className="text-gray-800">
                    {Math.round(selectedFood.nutrition.fats * servings)}g
                  </div>
                  <div className="text-sm text-gray-600">Fats</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddFood}
              className="w-full py-3 bg-gradient-to-br from-red-300 to-red-400 text-white rounded-xl hover:from-red-400 hover:to-red-500 transition-all"
            >
              {isPlanned ? 'Add to Meal Plan' : 'Add to Today'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
