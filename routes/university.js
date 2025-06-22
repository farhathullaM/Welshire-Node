import express from "express";
import {
  addUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversity,
  updateUniversity,
  upload,
} from "../controllers/universityController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  addUniversity
);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  updateUniversity
);
router.get("/", getAllUniversities);
router.get("/:id", getUniversity);
router.delete("/:id", deleteUniversity);

export default router;
