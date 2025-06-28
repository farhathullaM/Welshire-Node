import express from "express";
import {
  addApplication,
  deleteApplication,
  getAllApplications,
  getApplication,
} from "../controllers/applyController.js";

const router = express.Router();

router.post("/", addApplication);
router.get("/", getAllApplications);
router.get("/:id", getApplication);
router.delete("/:id", deleteApplication);

export default router;
