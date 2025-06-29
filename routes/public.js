import express from "express";
import {
  getUniversityDetails,
  getUniversityList,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/universities", getUniversityList);
router.get("/universities/:id", getUniversityDetails);
// router.get("/courses", getCourses);

export default router;
