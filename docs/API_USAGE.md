# Demo Project — Nutrition API (USDA FDC)

This document explains how the project's server-side API integrates the USDA Food Data Central (FDC) API and how you can use the API from other projects.

**Location in repo**
- Server entry: `app.js`
- Controller: `controllers/nutritionController.js`
- Model (USDA integration): `models/food.js`
- Views (web form): `views/index.ejs`
- Docs: `docs/API_USAGE.md` (this file)

---

## Overview

This Node.js + Express app acts as a thin server-side wrapper around the USDA Food Data Central API. It performs these tasks:
- Searches FDC for a food by name (top result)
- Fetches detailed nutrition data for the selected FDC item
- Extracts key macros (calories, protein, carbs, fat)
- Accepts an optional serving size and unit from the user, converts those to grams, and scales nutrient values accordingly

The wrapper provides a JSON API endpoint other projects can call, and a small HTML form for manual testing.

---

## Environment

The application expects an environment variable holding your USDA API key:
- `FDC_API_KEY` — USDA API key (place it in a `.env` file at project root or set in your environment).

Example `.env`:

```
FDC_API_KEY=your_real_usda_api_key_here
PORT=3000
```

Note: The repo currently also contains a hard-coded key in `models/food.js` used for development — replace with `process.env.FDC_API_KEY` or update `.env` to be safe for production.

---

## Endpoints

1) Web UI
- `GET /` — renders the search form (`views/index.ejs`)
- `POST /search` — accepts form data (`query`, optional `servingSize`, optional `unit`) and renders results

2) JSON API (recommended for use in other projects)
- `GET /api/nutrition` — returns a JSON object with nutrition info
  - Query parameters:
    - `query` (required): text search string (e.g., `banana`, `chicken breast`)
    - `servingSize` (optional): numeric amount in the selected `unit` (e.g., `8`)
    - `unit` (optional): weight unit for `servingSize`. Supported values: `g`, `oz`, `lb`, `kg`. Defaults to `g`.

Example request (curl):

```bash
curl "http://localhost:3000/api/nutrition?query=chicken%20breast&servingSize=8&unit=oz"
```

---

## Response Format

Successful response (HTTP 200) JSON example:

```json
{
  "description": "CHICKEN, BROILERS OR FRYERS, BREAST, MEAT AND SKIN, RAW",
  "fdcId": 123456,
  "dataType": "Branded",
  "servingSize": 8,
  "servingSizeUnit": "oz",
  "calories": 495.0,
  "protein": 60.0,
  "carbs": 0.0,
  "fat": 24.0
}
```

Fields:
- `description` — text description from FDC
- `fdcId` — FDC id of the food item
- `dataType` — FDC data type
- `servingSize` — the amount the response is calculated for (reflects user's requested size if provided)
- `servingSizeUnit` — the unit used for `servingSize` (user's selected unit)
- `calories`, `protein`, `carbs`, `fat` — numeric values scaled to `servingSize`; `null` if not available

Error responses:
- `400` — missing `query` parameter (or bad request)
- `500` — server error or downstream API failure; response body includes `details` with an error message

---

## How the scaling works

- The USDA FDC often returns nutrient amounts for a `servingSize` and `servingSizeUnit` included in its `food` object. If not present, the model assumes `100 g` as default.
- The wrapper converts both the FDC serving and the user-specified serving to grams using the following mapping:
  - `g`: 1
  - `oz`: 28.3495
  - `lb`: 453.592
  - `kg`: 1000
- Scale factor = `userGrams / apiGrams`. Nutrients are multiplied by this factor.
- The `servingSizeUnit` in the response will reflect the unit the user provided. If the user did not provide a unit, it will be the API's unit or `g`.

---

## Using this API from another Node.js project

1) Install `axios` (the example uses axios):

```bash
npm install axios
```

2) Example client (Node.js) — minimal:

```javascript
import axios from 'axios';

async function getNutrition(query, amount, unit = 'g') {
  const url = 'http://localhost:3000/api/nutrition';
  const params = { query };
  if (amount) params.servingSize = amount;
  if (unit) params.unit = unit;

  const res = await axios.get(url, { params });
  return res.data;
}

(async () => {
  const data = await getNutrition('banana', 2, 'oz');
  console.log(data);
})();
```

3) Example client (fetch / browser):

```javascript
const params = new URLSearchParams({ query: 'chicken breast', servingSize: '200', unit: 'g' });
fetch('/api/nutrition?' + params.toString())
  .then(r => r.json())
  .then(data => console.log(data));
```

Note: if your client runs on a different host/port than this demo server, enable CORS in the Express app (add `cors` package and `app.use(cors())`) or proxy requests.

---

## Notes and caveats

- USDA rate limits and API usage: respect USDA FDC terms of use and check rate limits for production.
- Data quality: not all FDC items include the same nutrients or define a serving size/unit; the wrapper uses fallbacks and returns `null` if a nutrient is absent.
- Security: do not commit real API keys to source control. Use environment variables and secrets management.
- Units: if you want additional units (e.g., milliliters), add them to the `UNIT_TO_GRAMS` mapping and adjust logic accordingly; remember that volume & weight differ by food density.

---

## Where to change behavior in this repo

- `models/food.js`: conversion factors (`UNIT_TO_GRAMS`), nutrient extraction and scaling logic — modify here to support more nutrients or change scaling rules.
- `controllers/nutritionController.js`: how inputs are read and passed to the model; add validation here.
- `views/index.ejs`: web form for interactive testing; modify if you want a different front-end.

---

If you'd like, I can:
- Add a small CORS-enabled example server snippet for production use.
- Add more nutrients (saturated fat, fiber, sugar) to the response.
- Add unit conversion UI hints and client-side validation.

File created: `docs/API_USAGE.md`
