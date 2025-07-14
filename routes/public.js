import express from "express";
import {
  getBlogs,
  getCourse,
  getFaqs,
  getTestimonials,
  getUniversityDetails,
  getUniversityList,
} from "../controllers/publicController.js";
import { suggestUniversities } from "../controllers/universitySuggestionController.js";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/universities", getUniversityList);
router.get("/universities/:id", getUniversityDetails);
router.get("/courses", getCourse);
router.get("/faqs", getFaqs);
router.get("/testimonials", getTestimonials);
router.get("/blogs", getBlogs);
router.post("/suggest", suggestUniversities);
router.post("/contact", createContact);

export default router;
