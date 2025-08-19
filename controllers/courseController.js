import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/Course.js";
import University from "../models/University.js";
import { s3 } from "../utils/s3.js";

// Multer Memory Storage for S3 Uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|avif|apng/;
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

  // Validation
  if (!university_id || !name) {
    res.status(400);
    throw new Error("University id and name is mandatory");
  }

  // Check if university exist
  const university = await University.findById(university_id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  // Image upload to S3
  let imageUrl = null;
  let imageKey = null;

  if (req.file) {
    imageKey = `uploads/courses/${uuidv4()}_${req.file.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise();
    imageUrl = uploadRes.Location;
  }

  const course = await Course.create({
    university_id,
    name,
    description,
    image: imageUrl,
    imageKey,
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
    duration,
    fees,
    mode,
    eligibility,
  } = req.body;

  // Check if course exist
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if university exist
  if (university_id) {
    const university = await University.findById(university_id);
    if (!university) {
      res.status(404);
      throw new Error("University not found");
    }
  }

  // Prepare update object
  const updateData = {
    name: name || course.name,
    description: description || course.description,
    duration: duration || course.duration,
    fees: fees || course.fees,
    mode: mode || course.mode,
    eligibility: eligibility || course.eligibility,
  };

  // Handle image update
  if (req.file) {
    // Delete old image from S3
    if (course.imageKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: course.imageKey,
        })
        .promise();
    }

    // Upload new image to S3
    const newImageKey = `uploads/courses/${uuidv4()}_${req.file.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newImageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise();

    updateData.image = uploadRes.Location;
    updateData.imageKey = newImageKey;
  }

  // Update course
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    updateData,
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

  // Delete image from S3
  if (course.imageKey) {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: course.imageKey,
      })
      .promise();
  }

  await Course.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Course deleted successfully" });
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).json(course);
});

const getAllCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    name: { $regex: search, $options: "i" },
  };

  const skip = (page - 1) * limit;

  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .populate("university_id", "name") // populate university's name only
    .skip(skip)
    .limit(limit);

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
