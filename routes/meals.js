import express from "express";
import { mealController } from "../controllers/mealController.js";

const router = express.Router();

router
  .route("/")
  .get(mealController.list)
  .post(mealController.create);

router
  .route("/:id")
  .get(mealController.getById)
  .put(mealController.update)
  .delete(mealController.remove);

export default router;
