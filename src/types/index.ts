export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Food {
  id: string;
  name: string;
  servingSize: string;
  nutrition: NutritionInfo;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  servingSize: string;
  servings: number;
  nutrition: NutritionInfo;
  date: string; // ISO date string
  isPlanned?: boolean;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
