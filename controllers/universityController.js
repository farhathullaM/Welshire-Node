import asyncHandler from "express-async-handler";
import University from "../models/University.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../utils/s3.js";


// Multer Memory Storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|avif|apng/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// Add University
const addUniversity = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, type, description } = req.body;
  if (!name || !type) {
    res.status(400);
    throw new Error("Name and type are mandatory");
  }

  let imageUrl = null;
  let iconUrl = null;
  let imageKey = null;
  let iconKey = null;

  if (req.files?.image?.[0]) {
    const imageFile = req.files.image[0];
    imageKey = `uploads/${uuidv4()}_${imageFile.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
      })
      .promise();
    imageUrl = uploadRes.Location;
  }

  if (req.files?.icon?.[0]) {
    const iconFile = req.files.icon[0];
    iconKey = `uploads/${uuidv4()}_${iconFile.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: iconKey,
        Body: iconFile.buffer,
        ContentType: iconFile.mimetype,
      })
      .promise();
    iconUrl = uploadRes.Location;
  }

  const university = await University.create({
    name,
    type,
    description,
    image: imageUrl,
    imageKey,
    icon: iconUrl,
    iconKey,
  });

  res.status(201).json(university);
});

// Get All Universities
const getAllUniversities = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const query = { name: { $regex: search, $options: "i" } };
  const skip = (page - 1) * limit;

  const universities = await University.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await University.countDocuments(query);

  res.json({ total, page, limit, universities });
});

// Get Single University
const getUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }
  res.json(university);
});

// Delete University
const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  // Delete files from S3
  if (university.imageKey) {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: university.imageKey,
      })
      .promise();
  }
  if (university.iconKey) {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: university.iconKey,
      })
      .promise();
  }

  await university.deleteOne();
  res.json({ message: "University deleted successfully" });
});

// Update University
const updateUniversity = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  let updatedImageUrl = university.image;
  let updatedIconUrl = university.icon;
  let updatedImageKey = university.imageKey;
  let updatedIconKey = university.iconKey;

  if (req.files?.image?.[0]) {
    // Delete old image from S3
    if (university.imageKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: university.imageKey,
        })
        .promise();
    }
    const imageFile = req.files.image[0];
    const newImageKey = `uploads/${uuidv4()}_${imageFile.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newImageKey,
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
      })
      .promise();
    updatedImageUrl = uploadRes.Location;
    updatedImageKey = newImageKey;
  }

  if (req.files?.icon?.[0]) {
    // Delete old icon from S3
    if (university.iconKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: university.iconKey,
        })
        .promise();
    }
    const iconFile = req.files.icon[0];
    const newIconKey = `uploads/${uuidv4()}_${iconFile.originalname}`;
    const uploadRes = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newIconKey,
        Body: iconFile.buffer,
        ContentType: iconFile.mimetype,
      })
      .promise();
    updatedIconUrl = uploadRes.Location;
    updatedIconKey = newIconKey;
  }

  university.name = name || university.name;
  university.type = type || university.type;
  university.description = description || university.description;
  university.image = updatedImageUrl;
  university.imageKey = updatedImageKey;
  university.icon = updatedIconUrl;
  university.iconKey = updatedIconKey;

  const updatedUniversity = await university.save();
  res.json(updatedUniversity);
});

export {
  upload,
  addUniversity,
  getAllUniversities,
  getUniversity,
  deleteUniversity,
  updateUniversity,
};
