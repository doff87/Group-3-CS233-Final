import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MealEntry, DailyGoals } from '../types';

interface NutritionContextType {
  meals: MealEntry[];
  addMeal: (meal: Omit<MealEntry, 'id'>) => void;
  deleteMeal: (id: string) => void;
  dailyGoals: DailyGoals;
  updateDailyGoals: (goals: DailyGoals) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });

  const addMeal = (meal: Omit<MealEntry, 'id'>) => {
    const newMeal: MealEntry = {
      ...meal,
      id: `${Date.now()}-${Math.random()}`,
    };
    setMeals([...meals, newMeal]);
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const updateDailyGoals = (goals: DailyGoals) => {
    setDailyGoals(goals);
  };

  return (
    <NutritionContext.Provider value={{ meals, addMeal, deleteMeal, dailyGoals, updateDailyGoals }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};
