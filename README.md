# How the project worked:
Amandaleeanne Took meeting notes, arranged meetings and took lead as PM for smooth transition. Not much can be shown for this other than the Meeting notes submitted in the Meeting notes folder. However, within the first meeting notes you can see the genreal timeline and what everyone should have been doing and contributing to the project.

In general:
Dannika and Amandaleeanne worked in Figma for planning out the Presentation of the application.

Dannika worked on implementing the client side looks of the application (Client side and folder)

You can refer to the planning of the Figma design here:
https://www.figma.com/design/1Go7Kibzn3ZIlcXXexVATO/CS233-Final?node-id=0-1&p=f&t=CSgbBWftpDXAwxHB-0
This is the final creation of the Figma design with code provided:
https://www.figma.com/make/tG6cjcZdaeJpmLl2Yaejqr/Foodie?node-id=0-1&p=f&t=NQ4jJjs0Z9BdL28w-0

Joel and David worked on the Application layer and implementation of API's and the business logic controlling what happens when something in the client is interacted with.

Amandaleeanne worked on the Database layer by setting up AWS, and linking the database together and making sure the models were in-line with what was expected to happen with data as well as security. 

## Architecture overview

- **Platform:** Node.js + Express.js, structured using MVC.
- **Models:** Business/data logic lives in `models/` (`food.js` for USDA integration, `meal.js` for application data).
- **Controllers:** HTTP orchestration lives in `controllers/` (`nutritionController`, `mealController`).
- **Routes:** REST routers in `routes/` mount controllers under `/api/*`.
- **Client:** React (Vite) front end consumes the REST API and will later persist to a real database hosted in AWS.

This structure keeps controllers thin, encapsulates data rules inside models, and makes it straightforward to swap the in-memory meal store with an actual database layer when the AWS infrastructure is ready.

## REST endpoints

| Method & path          | Description                            |
|------------------------|----------------------------------------|
| `GET /api/nutrition`   | USDA lookup (query or `fdcId`)         |
| `GET /api/meals`       | List meals (CRUD read)                 |
| `GET /api/meals/:id`   | Fetch a single meal                    |
| `POST /api/meals`      | Create a meal                          |
| `PUT /api/meals/:id`   | Update a meal                          |
| `DELETE /api/meals/:id`| Delete a meal                          |

Meals are currently stored in-memory through `MealModel`, but the abstraction mirrors a typical database repository so it can be replaced with Prisma/Mongoose/SQL later without touching controllers or routes.

## Running the application locally

1. Copy `.env.example` to `.env` and set `FDC_API_KEY` to a valid USDA FoodData Central API key. Optionally override `PORT` if you want the API to listen on a different port (defaults to `3000`).
2. Install dependencies: `npm install`.
3. Start the Express API server: `npm run server` (serves `GET /api/nutrition`).
4. In a second terminal start the Vite client: `npm run dev` (opens on [http://localhost:5173](http://localhost:5173)).

During development the Vite dev server proxies every `/api/*` request to the Express server, so the React app can simply call `/api/nutrition?...` without worrying about CORS or port numbers. When deploying, run `npm run build` and serve the generated `dist` directory with the Express app or any static host, keeping the API server online.
