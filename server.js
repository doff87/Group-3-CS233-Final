import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const API_KEY = xWdDwQnQACdhBasEbm6pNo2ZW8y9AB6kVOVf1xaj;
const FDC_BASE = "https://api.nal.usda.gov/fdc/v1";

if (!API_KEY) {
  console.warn("⚠️ No FDC_API_KEY set in .env!");
}

// helper: pick macros from foodNutrients[]
function extractMacros(food) {
  const nutrients = food.foodNutrients || [];

  const find = (name, unit) =>
    nutrients.find(
      (n) =>
        n.nutrientName === name &&
        (!unit || n.unitName.toLowerCase() === unit.toLowerCase())
    );

  // Energy (kcal) – this may be "Energy" or an Atwater energy entry
  const energy =
    find("Energy", "kcal") ||
    nutrients.find(
      (n) =>
        n.nutrientName.includes("Energy") &&
        n.unitName.toLowerCase() === "kcal"
    );

  const protein = find("Protein");
  const carbs = find("Carbohydrate, by difference");
  const fat = find("Total lipid (fat)");

  return {
    calories: energy?.value ?? null,
    protein: protein?.value ?? null,
    carbs: carbs?.value ?? null,
    fat: fat?.value ?? null,
    unit: food.servingSizeUnit || "per 100 g", // depends on the item
  };
}

// GET /api/nutrition?query=banana
app.get("/api/nutrition", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Missing ?query" });
  }

  try {
    // 1) Search for the food
    const searchUrl = new URL(`${FDC_BASE}/foods/search`);
    searchUrl.searchParams.set("api_key", API_KEY);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("pageSize", "1"); // top result only

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      return res
        .status(searchRes.status)
        .json({ error: "FDC search failed" });
    }

    const searchData = await searchRes.json();
    const firstFood = searchData.foods?.[0];
    if (!firstFood) {
      return res.status(404).json({ error: "No foods found" });
    }

    const fdcId = firstFood.fdcId;

    // 2) Get full details for that food
    const detailUrl = new URL(`${FDC_BASE}/food/${fdcId}`);
    detailUrl.searchParams.set("api_key", API_KEY);

    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) {
      return res
        .status(detailRes.status)
        .json({ error: "FDC detail fetch failed" });
    }

    const foodDetail = await detailRes.json();
    const macros = extractMacros(foodDetail);

    res.json({
      description: foodDetail.description,
      fdcId,
      dataType: foodDetail.dataType,
      ...macros,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});