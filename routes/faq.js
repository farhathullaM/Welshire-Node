import express from "express";
import {
  addFaq,
  deleteFaq,
  getAllFaqs,
  trashFaq,
  updateFaq,
} from "../controllers/faqController.js";

const router = express.Router();

router.post("/", addFaq);
router.get("/", getAllFaqs);
router.put("/:id", updateFaq);
router.patch("/:id", trashFaq);
router.delete("/:id", deleteFaq);

export default router;
