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
router.get(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  getAllApplications
);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  getApplication
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  deleteApplication
);

export default router;
