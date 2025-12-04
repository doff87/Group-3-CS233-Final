import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MealEntry, DailyGoals } from '../types';
import { useAuth } from './AuthContext';
import api from '../utils/apiClient';

interface NutritionContextType {
  meals: MealEntry[];
  addMeal: (meal: Omit<MealEntry, 'id'>) => void;
  deleteMeal: (id: string) => void;
  dailyGoals: DailyGoals;
  updateDailyGoals: (goals: DailyGoals) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });

  // Create meal on server and append to state
  const addMeal = async (meal: Omit<MealEntry, 'id'>) => {
    if (!token) throw new Error('Not authenticated');
    const res = await api.post('/meals', meal);
    const created = res.data;
    setMeals(prev => [...prev, created]);
    return created;
  };

  const deleteMeal = async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await api.delete(`/meals/${id}`);
    if (res.status !== 204 && res.status !== 200) {
      throw new Error('Failed to delete meal');
    }
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  // Load meals when token changes (login/logout)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setMeals([]);
        return;
      }
      try {
        const res = await api.get('/meals');
        if (res.status === 200) {
          const data = res.data;
          if (!cancelled) setMeals(data);
        } else {
          setMeals([]);
        }
        // Also load user settings (dailyGoals)
        try {
          const me = await api.get('/auth/me');
          if (me.status === 200 && !cancelled) {
            const g = me.data?.dailyGoals;
            if (g) setDailyGoals(g);
          }
        } catch (e) {
          // ignore settings load errors
        }
      } catch (e) {
        console.error('Failed to load meals', e);
        setMeals([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  const updateDailyGoals = (goals: DailyGoals) => {
    setDailyGoals(goals);
    // persist to server (best-effort)
    (async () => {
      try {
        await api.put('/auth/me', { dailyGoals: goals });
      } catch (e) {
        console.warn('Failed to persist daily goals', e);
      }
    })();
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
