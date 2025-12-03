import "dotenv/config";
import axios from "axios";

const API_KEY = process.env.FDC_API_KEY;
const FDC_BASE = "https://api.nal.usda.gov/fdc/v1";

if (!API_KEY) {
  console.warn("⚠️ No FDC_API_KEY set in the environment. Nutrition lookups will fail until it is configured.");
}

// Conversion factors to grams
const UNIT_TO_GRAMS = {
  g: 1,
  oz: 28.3495,
  lb: 453.592,
  kg: 1000
};

const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error("Missing FDC_API_KEY in environment");
  }
  return API_KEY;
};

const getName = (entry) => entry?.nutrient?.name ?? entry?.nutrientName ?? "";
const getUnit = (entry) => entry?.nutrient?.unitName ?? entry?.unitName ?? "";
const getAmount = (entry) =>
  entry?.amount ?? entry?.value ?? entry?.nutrient?.amount ?? null;

const withAcceptJson = {
  headers: {
    Accept: "application/json",
  },
};

export class FoodModel {
  static async searchFood(query, servingSize = null, unit = "g") {
    if (!query) {
      throw new Error("Query is required");
    }

    const apiKey = ensureApiKey();

    // 1) Search for the food
    const searchUrl = new URL(`${FDC_BASE}/foods/search`);
    searchUrl.searchParams.set("api_key", apiKey);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("pageSize", "1"); // top result only

    const searchRes = await axios.get(searchUrl.toString(), withAcceptJson);
    if (searchRes.status !== 200) {
      if (searchRes.status === 403) {
        throw new Error("Invalid API key. Please check your FDC_API_KEY in .env");
      }
      throw new Error(`FDC search failed: ${searchRes.status}`);
    }

    const searchData = searchRes.data;
    const firstFood = searchData.foods?.[0];
    if (!firstFood) {
      throw new Error("No foods found");
    }

    const fdcId = firstFood.fdcId;

    // 2) Get full details for that food
    return this.fetchByFdcId(fdcId, servingSize, unit);
  }

  static async fetchByFdcId(fdcId, servingSize = null, unit = "g") {
    if (!fdcId) {
      throw new Error("FDC ID is required");
    }

    const apiKey = ensureApiKey();

    const detailUrl = new URL(`${FDC_BASE}/food/${fdcId}`);
    detailUrl.searchParams.set("api_key", apiKey);

    const detailRes = await axios.get(detailUrl.toString(), withAcceptJson);
    if (detailRes.status !== 200) {
      if (detailRes.status === 403) {
        throw new Error("Invalid API key. Please check your FDC_API_KEY in .env");
      }
      if (detailRes.status === 404) {
        throw new Error("Food not found");
      }
      throw new Error(`FDC detail fetch failed: ${detailRes.status}`);
    }

    const foodDetail = detailRes.data;
    return this.extractMacros(foodDetail, servingSize, unit);
  }

  static extractMacros(food, servingSize = null, unit = "g") {
    const nutrients = food.foodNutrients || [];

    const find = (name, unit) =>
      nutrients.find((n) => {
        const nutrientName = getName(n);
        const unitName = getUnit(n);
        return (
          nutrientName === name &&
          (!unit || unitName?.toLowerCase() === unit.toLowerCase())
        );
      });

    // Energy (kcal) – this may be "Energy" or an Atwater energy entry
    const energy =
      find("Energy", "kcal") ||
      nutrients.find((n) => {
        const nutrientName = getName(n);
        const unitName = getUnit(n)?.toLowerCase();
        return nutrientName?.includes("Energy") && unitName === "kcal";
      });

    const protein = find("Protein");
    const carbs = find("Carbohydrate, by difference");
    const fat = find("Total lipid (fat)");

    const apiServingSize = food.servingSize || 100;
    const apiUnitLabel = food.servingSizeUnit || "g";
    const apiUnit = apiUnitLabel.toLowerCase();
    const apiFactor = UNIT_TO_GRAMS[apiUnit] ?? 1;
    const apiGramsRaw = apiServingSize * apiFactor;
    const apiGrams = Number.isFinite(apiGramsRaw) && apiGramsRaw > 0 ? apiGramsRaw : apiServingSize;

    let displayServingSize = apiServingSize;
    let displayUnit = apiUnitLabel;
    let scale = 1;

    if (servingSize && Number.isFinite(servingSize)) {
      const normalizedUnit = (unit || "g").toLowerCase();
      const userFactor = UNIT_TO_GRAMS[normalizedUnit] ?? 1;
      const userGramsRaw = servingSize * userFactor;
      const userGrams = Number.isFinite(userGramsRaw) && userGramsRaw > 0 ? userGramsRaw : servingSize;
      const nextScale = userGrams / apiGrams;
      scale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
      displayServingSize = servingSize;
      displayUnit = unit || "g";
    }

    return {
      description: food.description,
      fdcId: food.fdcId,
      dataType: food.dataType,
      servingSize: displayServingSize,
      servingSizeUnit: displayUnit,
      calories: getAmount(energy) ? getAmount(energy) * scale : null,
      protein: getAmount(protein) ? getAmount(protein) * scale : null,
      carbs: getAmount(carbs) ? getAmount(carbs) * scale : null,
      fat: getAmount(fat) ? getAmount(fat) * scale : null,
    };
  }
}