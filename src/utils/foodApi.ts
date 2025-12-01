import { Food } from '../types';

// Mock food database - In production, this would call an external API like USDA FoodData Central
const mockFoodDatabase: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast (Grilled)',
    servingSize: '100g',
    nutrition: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  },
  {
    id: '2',
    name: 'Brown Rice (Cooked)',
    servingSize: '1 cup',
    nutrition: { calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  },
  {
    id: '3',
    name: 'Broccoli (Steamed)',
    servingSize: '1 cup',
    nutrition: { calories: 55, protein: 3.7, carbs: 11, fats: 0.6 },
  },
  {
    id: '4',
    name: 'Salmon (Grilled)',
    servingSize: '100g',
    nutrition: { calories: 206, protein: 22, carbs: 0, fats: 13 },
  },
  {
    id: '5',
    name: 'Sweet Potato (Baked)',
    servingSize: '1 medium',
    nutrition: { calories: 103, protein: 2.3, carbs: 24, fats: 0.2 },
  },
  {
    id: '6',
    name: 'Eggs (Large)',
    servingSize: '1 egg',
    nutrition: { calories: 72, protein: 6, carbs: 0.6, fats: 5 },
  },
  {
    id: '7',
    name: 'Oatmeal (Cooked)',
    servingSize: '1 cup',
    nutrition: { calories: 154, protein: 6, carbs: 27, fats: 3 },
  },
  {
    id: '8',
    name: 'Greek Yogurt (Plain)',
    servingSize: '1 cup',
    nutrition: { calories: 130, protein: 11, carbs: 9, fats: 5 },
  },
  {
    id: '9',
    name: 'Avocado',
    servingSize: '1 medium',
    nutrition: { calories: 240, protein: 3, carbs: 13, fats: 22 },
  },
  {
    id: '10',
    name: 'Banana',
    servingSize: '1 medium',
    nutrition: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  },
  {
    id: '11',
    name: 'Almonds',
    servingSize: '28g (1 oz)',
    nutrition: { calories: 164, protein: 6, carbs: 6, fats: 14 },
  },
  {
    id: '12',
    name: 'Whole Wheat Bread',
    servingSize: '1 slice',
    nutrition: { calories: 81, protein: 4, carbs: 14, fats: 1.1 },
  },
  {
    id: '13',
    name: 'Peanut Butter',
    servingSize: '2 tbsp',
    nutrition: { calories: 188, protein: 8, carbs: 7, fats: 16 },
  },
  {
    id: '14',
    name: 'Apple',
    servingSize: '1 medium',
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  },
  {
    id: '15',
    name: 'Spinach (Raw)',
    servingSize: '1 cup',
    nutrition: { calories: 7, protein: 0.9, carbs: 1.1, fats: 0.1 },
  },
];

export const searchFoods = async (query: string): Promise<Food[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim()) {
    return mockFoodDatabase;
  }
  
  const lowerQuery = query.toLowerCase();
  return mockFoodDatabase.filter(food =>
    food.name.toLowerCase().includes(lowerQuery)
  );
};

export const getFoodById = async (id: string): Promise<Food | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockFoodDatabase.find(food => food.id === id);
};
