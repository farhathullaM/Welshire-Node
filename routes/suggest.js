import express from "express";
import {
  deleteSuggestion,
  getAllSuggestions,
} from "../controllers/universitySuggestionController.js";

const router = express.Router();

router.get("/", getAllSuggestions);
router.delete("/", deleteSuggestion);

export default router;
