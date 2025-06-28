import asyncHandler from "express-async-handler";
import University from "../models/University.js";
import Course from "../models/Course.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { deleteFileWithFolderName } from "../helpers/fileDelete.js";

const uploadPath = path.join("uploads", "university");
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

const addUniversity = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;
  if (!name || !type) {
    res.status(400);
    throw new Error("Name and type is mandatory");
  }

  let imageName = null;
  let iconName = null;

  if (req.files) {
    imageName = req.files.image ? req.files.image[0].filename : null;
    iconName = req.files.icon ? req.files.icon[0].filename : null;
  }

  const university = await University.create({
    name,
    type,
    description,
    image: imageName,
    icon: iconName,
  });
  res.status(201).json(university);
});

const getAllUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({}).select("name");
  res.status(200).send(universities);
});

const getUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  const courses = await Course.find({ university_id: req.params.id });

  res.status(200).json({
    university,
    courses,
  });
});

const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }
  if (university.image) {
    await deleteFileWithFolderName(uploadPath, university.image);
  }
  if (university.icon) {
    await deleteFileWithFolderName(uploadPath, university.icon);
  }

  await University.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "University deleted successfully" });
});

const updateUniversity = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;

  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  // Prepare update object
  const updateData = {
    name: name || university.name,
    type: type || university.type,
    description: description || university.description,
  };

  // Handle file updates
  let newImageName = university.image;
  let newIconName = university.icon;

  if (req.files) {
    // If using upload.fields([{name: 'image'}, {name: 'icon'}])
    if (req.files.image) {
      // Delete old image if exists
      if (university.image) {
        await deleteFileWithFolderName(uploadPath, university.image);
      }
      newImageName = req.files.image[0].filename;
    }

    if (req.files.icon) {
      // Delete old icon if exists
      if (university.icon) {
        await deleteFileWithFolderName(uploadPath, university.icon);
      }
      newIconName = req.files.icon[0].filename;
    }
  } else if (req.file) {
    // If using single file upload, you need to specify which field it's for
    // This is problematic as you can't distinguish between image and icon
    console.warn(
      "Single file upload detected - cannot distinguish between image and icon"
    );
  }

  // Update the data object with new file names
  updateData.image = newImageName;
  updateData.icon = newIconName;

  // Update the university
  const updatedUniversity = await University.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedUniversity);
});

export {
  upload,
  addUniversity,
  getAllUniversities,
  deleteUniversity,
  getUniversity,
  updateUniversity,
};
