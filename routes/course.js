import express from "express";
import { addCourse, upload } from "../controllers/courseController.js";

const router = express.Router();

router.post("/", upload.single("image"), addCourse);
// router.put("/", upload.single("image"), addCourse);

export default router;
