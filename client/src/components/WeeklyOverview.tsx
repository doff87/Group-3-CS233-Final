import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { toLocalDateString } from '../utils/date';

export const WeeklyOverview = () => {
  const { meals, dailyGoals } = useNutrition();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });

  const getDayOfWeek = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getDayData = (date: Date) => {
    const dateStr = toLocalDateString(date);
    const dayMeals = meals.filter(meal => meal.date === dateStr && !meal.isPlanned);
    
    return dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories * meal.servings,
        protein: acc.protein + meal.nutrition.protein * meal.servings,
        carbs: acc.carbs + meal.nutrition.carbs * meal.servings,
        fats: acc.fats + meal.nutrition.fats * meal.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const weekDates = getWeekDates();
  const weekData = weekDates.map(date => ({
    date,
    data: getDayData(date),
  }));

  const weekTotals = weekData.reduce(
    (acc, day) => ({
      calories: acc.calories + day.data.calories,
      protein: acc.protein + day.data.protein,
      carbs: acc.carbs + day.data.carbs,
      fats: acc.fats + day.data.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const dailyAverage = {
    calories: weekTotals.calories / 7,
    protein: weekTotals.protein / 7,
    carbs: weekTotals.carbs / 7,
    fats: weekTotals.fats / 7,
  };

  const previousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDateRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    
    const startStr = currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-800 mb-2">Weekly Overview</h1>
        <p className="text-gray-600">Track your weekly nutrition progress</p>
      </div>

      {/* Week Navigation */}
      <div className="bg-gradient-to-br from-red-300 to-red-400 rounded-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousWeek}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-white">{formatDateRange()}</h2>
          <button
            onClick={nextWeek}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Daily Average */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="text-gray-800 mb-4">Daily Average</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-gray-800 text-3xl">{Math.round(dailyAverage.calories)}</div>
              <div className="text-gray-600 text-sm mt-1">Calories</div>
              <div className="text-gray-500 text-xs mt-1">
                Goal: {dailyGoals.calories}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-800 text-3xl">{Math.round(dailyAverage.protein)}g</div>
              <div className="text-gray-600 text-sm mt-1">Protein</div>
              <div className="text-gray-500 text-xs mt-1">
                Goal: {dailyGoals.protein}g
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-800 text-3xl">{Math.round(dailyAverage.carbs)}g</div>
              <div className="text-gray-600 text-sm mt-1">Carbs</div>
              <div className="text-gray-500 text-xs mt-1">
                Goal: {dailyGoals.carbs}g
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-800 text-3xl">{Math.round(dailyAverage.fats)}g</div>
              <div className="text-gray-600 text-sm mt-1">Fats</div>
              <div className="text-gray-500 text-xs mt-1">
                Goal: {dailyGoals.fats}g
              </div>
            </div>
          </div>
        </div>

        {/* Week Totals */}
        <div className="bg-white bg-opacity-20 rounded-2xl p-6">
          <h3 className="text-white mb-4">Week Totals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white text-2xl">{Math.round(weekTotals.calories)}</div>
              <div className="text-white text-opacity-90 text-sm mt-1">Calories</div>
            </div>
            <div>
              <div className="text-white text-2xl">{Math.round(weekTotals.protein)}g</div>
              <div className="text-white text-opacity-90 text-sm mt-1">Protein</div>
            </div>
            <div>
              <div className="text-white text-2xl">{Math.round(weekTotals.carbs)}g</div>
              <div className="text-white text-opacity-90 text-sm mt-1">Carbs</div>
            </div>
            <div>
              <div className="text-white text-2xl">{Math.round(weekTotals.fats)}g</div>
              <div className="text-white text-opacity-90 text-sm mt-1">Fats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-gray-800 mb-4">Daily Breakdown</h3>
        <div className="space-y-3">
          {weekData.map(({ date, data }) => (
            <div
              key={toLocalDateString(date)}
              className={`rounded-xl p-4 ${
                isToday(date)
                  ? 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="min-w-[140px]">
                  <div className={isToday(date) ? 'text-red-700' : 'text-gray-800'}>
                    {getDayOfWeek(date)}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Calories: </span>
                    <span className={isToday(date) ? 'text-red-700' : 'text-gray-800'}>
                      {Math.round(data.calories)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein: </span>
                    <span className={isToday(date) ? 'text-red-700' : 'text-gray-800'}>
                      {Math.round(data.protein)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs: </span>
                    <span className={isToday(date) ? 'text-red-700' : 'text-gray-800'}>
                      {Math.round(data.carbs)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fats: </span>
                    <span className={isToday(date) ? 'text-red-700' : 'text-gray-800'}>
                      {Math.round(data.fats)}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
