import { Food } from '../types';

type ApiFoodResponse = {
  fdcId?: number | string;
  description?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
};

const API_BASE_PATH = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

const safeNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const normalizeFood = (data: ApiFoodResponse): Food => {
  const id = data.fdcId ? String(data.fdcId) : crypto.randomUUID?.() ?? `${Date.now()}`;
  const servingAmount = safeNumber(data.servingSize, 100);
  const servingUnit = data.servingSizeUnit ?? 'g';

  return {
    id,
    name: data.description ?? 'Unknown food',
    servingSize: `${servingAmount} ${servingUnit}`.trim(),
    nutrition: {
      calories: safeNumber(data.calories),
      protein: safeNumber(data.protein),
      carbs: safeNumber(data.carbs),
      fats: safeNumber(data.fat),
    },
  };
};

const buildUrl = (params: URLSearchParams) => `${API_BASE_PATH}/nutrition?${params.toString()}`;

const fetchFoods = async (params: URLSearchParams): Promise<Food[]> => {
  const response = await fetch(buildUrl(params));
  if (!response.ok) {
    const message = await response.text().catch(() => 'Failed to fetch food data');
    throw new Error(message || 'Failed to fetch food data');
  }

  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : [payload];
  return items.filter(Boolean).map(normalizeFood);
};

export const searchFoods = async (
  query: string,
  options?: { servingSize?: number; unit?: string }
): Promise<Food[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const params = new URLSearchParams({ query: trimmed });
  if (options?.servingSize) {
    params.set('servingSize', String(options.servingSize));
  }
  if (options?.unit) {
    params.set('unit', options.unit);
  }

  return fetchFoods(params);
};

export const getFoodById = async (
  fdcId: string,
  options?: { servingSize?: number; unit?: string }
): Promise<Food | undefined> => {
  if (!fdcId) {
    return undefined;
  }

  const params = new URLSearchParams({ fdcId });
  if (options?.servingSize) {
    params.set('servingSize', String(options.servingSize));
  }
  if (options?.unit) {
    params.set('unit', options.unit);
  }

  const foods = await fetchFoods(params);
  return foods[0];
};
