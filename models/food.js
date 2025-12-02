import axios from "axios";

const API_KEY =  "xWdDwQnQACdhBasEbm6pNo2ZW8y9AB6kVOVf1xaj";
const FDC_BASE = "https://api.nal.usda.gov/fdc/v1";

// Conversion factors to grams
const UNIT_TO_GRAMS = {
  g: 1,
  oz: 28.3495,
  lb: 453.592,
  kg: 1000
};

export class FoodModel {
  static async searchFood(query, servingSize = null, unit = 'g') {
    if (!query) {
      throw new Error("Query is required");
    }

    // 1) Search for the food
    const searchUrl = new URL(`${FDC_BASE}/foods/search`);
    searchUrl.searchParams.set("api_key", API_KEY);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("pageSize", "1"); // top result only

    const searchRes = await axios.get(searchUrl.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });
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
    const detailUrl = new URL(`${FDC_BASE}/food/${fdcId}`);
    detailUrl.searchParams.set("api_key", API_KEY);

    const detailRes = await axios.get(detailUrl.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (detailRes.status !== 200) {
      if (detailRes.status === 403) {
        throw new Error("Invalid API key. Please check your FDC_API_KEY in .env");
      }
      throw new Error(`FDC detail fetch failed: ${detailRes.status}`);
    }

    const foodDetail = detailRes.data;
    return this.extractMacros(foodDetail, servingSize, unit);
  }

  static extractMacros(food, servingSize = null, unit = 'g') {
    const nutrients = food.foodNutrients || [];

    const find = (name, unit) =>
      nutrients.find(
        (n) =>
          n.nutrient && n.nutrient.name === name &&
          (!unit || n.nutrient.unitName.toLowerCase() === unit.toLowerCase())
      );

    // Energy (kcal) – this may be "Energy" or an Atwater energy entry
    const energy =
      find("Energy", "kcal") ||
      nutrients.find(
        (n) =>
          n.nutrient && n.nutrient.name && n.nutrient.name.includes("Energy") &&
          n.nutrient.unitName && n.nutrient.unitName.toLowerCase() === "kcal"
      );

    const protein = find("Protein");
    const carbs = find("Carbohydrate, by difference");
    const fat = find("Total lipid (fat)");

    const apiServingSize = food.servingSize || 100;
    const apiUnit = food.servingSizeUnit || "g";
    const apiGrams = apiServingSize * (UNIT_TO_GRAMS[apiUnit.toLowerCase()] || 1);

    let displayServingSize = apiServingSize;
    let displayUnit = apiUnit;
    let scale = 1;

    if (servingSize) {
      const userGrams = servingSize * (UNIT_TO_GRAMS[unit] || 1);
      scale = userGrams / apiGrams;
      displayServingSize = servingSize;
      displayUnit = unit;
    }

    return {
      description: food.description,
      fdcId: food.fdcId,
      dataType: food.dataType,
      servingSize: displayServingSize,
      servingSizeUnit: displayUnit,
      calories: energy?.amount ? energy.amount * scale : null,
      protein: protein?.amount ? protein.amount * scale : null,
      carbs: carbs?.amount ? carbs.amount * scale : null,
      fat: fat?.amount ? fat.amount * scale : null,
    };
  }
}