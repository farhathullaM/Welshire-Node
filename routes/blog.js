import express from "express";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  upload,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", upload.single("image"), addBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlog);
router.delete("/:id", deleteBlog);

export default router;
