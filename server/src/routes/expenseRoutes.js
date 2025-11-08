import express from "express";
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.route("/").get(getExpenses).post(createExpense);
router
  .route("/:id")
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;

