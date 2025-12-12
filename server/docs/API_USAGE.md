# API Usage Guide

This reference describes the Express backend that powers the Foodie project. The server is written in Node.js, follows MVC conventions, and exposes RESTful endpoints for both USDA nutrition lookups and CRUD operations on meals.

## Project Layout

- **app.js** – Express composition root (middleware + route mounting).
- **controllers/** – HTTP orchestration logic (`nutritionController`, `mealController`).
- **models/** – Data-access/business logic (`food.js` for USDA, `meal.js` for app data).
- **routes/** – REST routers (`nutrition.js`, `meals.js`).
- **docs/API_USAGE.md** – this document.

## Environment

Create a `.env` from `.env.example` and set at minimum:

```
FDC_API_KEY=your_usda_key
PORT=3000
```

Optional Vite variables (`VITE_API_SERVER`, `VITE_API_BASE_URL`) control the React dev proxy.

## REST Endpoints

### Nutrition search

`GET /api/nutrition`

| Query param   | Required | Description                                             |
|---------------|----------|---------------------------------------------------------|
| `query`       | No*      | Search string. Required unless `fdcId` is provided.     |
| `fdcId`       | No       | Explicit FoodData Central ID.                           |
| `servingSize` | No       | Numeric amount to scale to.                             |
| `unit`        | No       | `g`, `oz`, `lb`, or `kg`. Defaults to `g`.              |

Example:

```bash
curl "http://localhost:3000/api/nutrition?query=chicken%20breast&servingSize=8&unit=oz"
```

### Meals CRUD

All endpoints return/accept JSON. Data is currently stored in-memory but the model abstraction allows swapping in a database later.

| Method & path        | Description            |
|----------------------|------------------------|
| `GET /api/meals`     | List all meals         |
| `GET /api/meals/:id` | Fetch a meal           |
| `POST /api/meals`    | Create a meal          |
| `PUT /api/meals/:id` | Update a meal          |
| `DELETE /api/meals/:id` | Remove a meal       |

`POST` / `PUT` payload example:

```json
{
  "foodName": "Chicken Salad",
  "foodId": "fdc-12345",
  "servingSize": "1",
  "servingUnit": "cup",
  "servings": 1,
  "nutrition": {
    "calories": 350,
    "protein": 28,
    "carbs": 12,
    "fats": 18
  },
  "date": "2025-12-02",
  "isPlanned": false
}
```

## Response shape (nutrition)

```
{
  "description": "CHICKEN, BROILERS OR FRYERS, BREAST...",
  "fdcId": 123456,
  "dataType": "Branded",
  "servingSize": 8,
  "servingSizeUnit": "oz",
  "calories": 495,
  "protein": 60,
  "carbs": 0,
  "fat": 24
}
```

If a nutrient is missing from FDC data, the value is `null` (backend) and defaults to `0` on the client.

## Error handling

- `400` – missing/invalid parameters.
- `404` – requested meal not found.
- `500` – upstream USDA failure or unhandled error.

## Extending the API

- Add more nutrients by editing `models/food.js`.
- Swap the in-memory meal store with a database inside `models/meal.js` (methods already encapsulate CRUD expectations).
- Add auth/rate limiting or CORS middleware in `app.js` before mounting routes.

This structure satisfies REST/MVC expectations today while leaving room for the upcoming AWS/container deployment and database integration.
