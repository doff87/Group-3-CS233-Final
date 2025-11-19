import { FoodEntry } from '../App';
import { MACRO_COLORS } from './constants';

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface PieDataItem {
  name: string;
  value: number;
  grams: number;
  color: string;
}

/**
 * Calculate total macros from an array of food entries
 */
export function calculateTotals(entries: FoodEntry[]): MacroTotals {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}

/**
 * Create pie chart data from macro totals
 */
export function createPieData(totals: MacroTotals): PieDataItem[] {
  return [
    { name: 'Protein', value: totals.protein, grams: totals.protein, color: MACRO_COLORS.protein },
    { name: 'Carbs', value: totals.carbs, grams: totals.carbs, color: MACRO_COLORS.carbs },
    { name: 'Fats', value: totals.fats, grams: totals.fats, color: MACRO_COLORS.fats },
  ];
}

/**
 * Filter entries by a specific date
 */
export function filterEntriesByDate(entries: FoodEntry[], date: string): FoodEntry[] {
  return entries.filter(e => e.date === date);
}

/**
 * Filter entries by a date range (inclusive)
 */
export function filterEntriesByDateRange(
  entries: FoodEntry[],
  startDate: Date,
  endDate: Date
): FoodEntry[] {
  return entries.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

/**
 * Group entries by date
 */
export function groupEntriesByDate(entries: FoodEntry[]): Record<string, FoodEntry[]> {
  return entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);
}