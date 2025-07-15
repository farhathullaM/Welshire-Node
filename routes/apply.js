import express from "express";
import {
  addApplication,
  deleteApplication,
  getAllApplications,
  getApplication,
} from "../controllers/applyController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", addApplication);
router.get("/", protect, authorizeRoles("admin"), getAllApplications);
router.get("/:id", protect, authorizeRoles("admin"), getApplication);
router.delete("/:id", protect, authorizeRoles("admin"), deleteApplication);

export default router;
