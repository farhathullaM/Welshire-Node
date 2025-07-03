import multer from "multer";
import fs from "fs";
import path from "path";
import asyncHandler from "express-async-handler";
import Testimonial from "../models/Testimonial.js";

const uploadPath = path.join("uploads", "testimonial");
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

// Configure multer to handle multiple files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const addTestimonial = asyncHandler(async (req, res) => {
  const { username, review, university, course } = req.body;
  if (!username || !review) {
    res.status(400);
    throw new Error("Username and review is mandatory");
  }

  let imageName = null;
  if (req.file) {
    imageName = req.file.filename;
  }

  const testimonial = await Testimonial.create({
    username,
    review,
    image: imageName,
    university,
    course,
  });
  res.status(201).json(testimonial);
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  const query = {
    name: { $regex: search, $options: "i" },
  };

  const skip = (page - 1) * limit;

  const testimonials = await Testimonial.find(query)
    .skip(skip)
    .limit(Number(limit));

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({ testimonials, total, page, limit });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  if (testimonial.image) {
    await deleteFileWithFolderName(uploadPath, testimonial.image);
  }
  await Testimonial.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Testimonial deleted successfully" });
});

export { upload, addTestimonial, getAllTestimonials, deleteTestimonial };
