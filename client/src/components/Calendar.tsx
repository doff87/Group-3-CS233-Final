import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayDetailModal } from './DayDetailModal';
import { useNutrition } from '../context/NutritionContext';

export const Calendar = () => {
  const { meals } = useNutrition();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayCalories = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeals = meals.filter(meal => meal.date === dateStr && !meal.isPlanned);
    return dayMeals.reduce((total, meal) => total + meal.nutrition.calories * meal.servings, 0);
  };

  const hasPlannedMeals = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meals.some(meal => meal.date === dateStr && meal.isPlanned);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const calories = getDayCalories(day);
    const hasPlanned = hasPlannedMeals(day);
    const todayClass = isToday(day);

    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`aspect-square rounded-xl p-2 transition-all hover:scale-105 ${
          todayClass
            ? 'bg-gradient-to-br from-red-400 to-red-500 text-white'
            : 'bg-gradient-to-br from-red-200 to-red-300 text-gray-800 hover:from-red-300 hover:to-red-400'
        }`}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div className={todayClass ? '' : ''}>{day}</div>
          {calories > 0 && (
            <div className={`text-xs mt-1 ${todayClass ? 'text-white' : 'text-gray-700'}`}>
              {Math.round(calories)} cal
            </div>
          )}
          {hasPlanned && (
            <div className={`text-xs ${todayClass ? 'text-white' : 'text-gray-600'}`}>
              📋
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Calendar Header */}
      <div className="bg-gradient-to-br from-red-300 to-red-400 rounded-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-white">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-gray-800 mb-4">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-500"></div>
            <span className="text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-200 to-red-300"></div>
            <span className="text-gray-700">Regular Day</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <span className="text-gray-700">Has Planned Meals</span>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};
