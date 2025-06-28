import express from "express";
import {
  addTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  upload,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.post("/", upload.single("image"), addTestimonial);
router.get("/", getAllTestimonials);
router.delete("/:id", deleteTestimonial);

export default router;
