import express from "express";
import {
  addFaq,
  deleteFaq,
  getAllFaqs,
  getFaqById,
  trashFaq,
  updateFaq,
} from "../controllers/faqController.js";

const router = express.Router();

router.post("/", addFaq);
router.get("/", getAllFaqs);
router.get("/:id", getFaqById);
router.put("/:id", updateFaq);
router.patch("/:id", trashFaq);
router.delete("/:id", deleteFaq);

export default router;
