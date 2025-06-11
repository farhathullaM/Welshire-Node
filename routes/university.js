import express from "express";
import {
  addUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversity,
  updateUniversity,
} from "../controllers/universityController.js";

const router = express.Router();

router.post("/", addUniversity);
router.get("/", getAllUniversities);
router.get("/:id", getUniversity);
router.put("/:id", updateUniversity);
router.delete("/:id", deleteUniversity);

export default router;
