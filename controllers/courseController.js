import asyncHandler from "express-async-handler";
import multer from "multer";
import fs from "fs";
import path from "path";
import Course from "../models/Course.js";
import University from "../models/University.js";
import { deleteFileWithFolderName } from "../utils/fileDelete.js";

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

const addCourse = asyncHandler(async (req, res) => {
  const {
    university_id,
    name,
    description,
    duration,
    fees,
    mode,
    eligibility,
  } = req.body;

  //validation
  if (!university_id || !name) {
    res.status(400);
    throw new Error("University id and name is mandatory");
  }

  //Check if university exist
  const university = await University.findById(university_id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  //image upload
  let imageName = null;
  if (req.file) {
    imageName = req.file.filename;
  }

  const course = await Course.create({
    university_id,
    name,
    description,
    image: imageName,
    duration,
    fees,
    mode,
    eligibility,
  });
  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const {
    university_id,
    name,
    description,
    image,
    duration,
    fees,
    mode,
    eligibility,
  } = req.body;

  //Check if course exist
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  //Check if university exist
  if (university_id) {
    const university = await University.findById(university_id);
    if (!university) {
      res.status(404);
      throw new Error("University not found");
    }
  }

  //prepare update object
  const updateData = {
    name: name || course.name,
    description: description || course.description,
    image: image || course.image,
    duration: duration || course.duration,
    fees: fees || course.fees,
    mode: mode || course.mode,
    eligibility: eligibility || course.eligibility,
  };

  //file update
  let newImageName = course.image;
  if (req.file) {
    if (course.image) {
      await deleteFileWithFolderName(uploadPath, course.image);
    }
    newImageName = req.file.filename;
  }

  //update course
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { ...updateData, image: newImageName },
    { new: true }
  );
  res.status(200).json(updatedCourse);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  if (course.image) {
    await deleteFileWithFolderName(uploadPath, course.image);
  }
  await Course.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Course deleted successfully" });
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.status(200).send(courses);
});

const getCourse = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  const query = {
    name: { $regex: search, $options: "i" },
  };

  const skip = (page - 1) * limit;

  const courses = await Course.find(query).skip(skip).limit(Number(limit));

  const total = await Course.countDocuments(query);

  res.status(200).json({
    total,
    page,
    limit,
    courses,
  });
});

export {
  upload,
  addCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
};
