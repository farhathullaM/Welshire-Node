import express from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  upload,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", upload.single("image"), addCourse);
router.put("/:id", upload.single("image"), updateCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourse);
router.delete("/:id", deleteCourse);

export default router;
