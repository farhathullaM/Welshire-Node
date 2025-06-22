import asyncHandler from "express-async-handler";
import multer from "multer";
import fs from "fs";
import path from "path";
import Course from "../models/Course.js";

const uploadPath = path.join("uploads", "course");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const addCourse = asyncHandler(async (req, res) => {
  // const
});

export { upload, addCourse };
