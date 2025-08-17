import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../utils/s3.js";

// Multer Memory Storage for S3 Uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
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

const addBlog = asyncHandler(async (req, res) => {
  const { title, description, author } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are mandatory");
  }

  let imageUrl = null;
  let imageKey = null;

  if (req.file) {
    imageKey = `uploads/${uuidv4()}_${req.file.originalname}`;
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

  const blog = await Blog.create({
    title,
    description,
    image: imageUrl,
    imageKey,
    author,
  });

  res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    title: { $regex: search, $options: "i" },
  };

  const skip = (page - 1) * limit;
  const blogs = await Blog.find(query).skip(skip).limit(limit);
  const total = await Blog.countDocuments(query);

  res.status(200).json({
    total,
    page,
    limit,
    blogs,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.imageKey) {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: blog.imageKey,
      })
      .promise();
  }

  await blog.deleteOne();
  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const updateData = {
    title: req.body.title || blog.title,
    description: req.body.description || blog.description,
    author: req.body.author || blog.author,
  };

  if (req.file) {
    // Delete old image from S3
    if (blog.imageKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: blog.imageKey,
        })
        .promise();
    }

    const newImageKey = `uploads/${uuidv4()}_${req.file.originalname}`;
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

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  res.status(200).json(updatedBlog);
});

export { addBlog, getAllBlogs, getBlog, deleteBlog, updateBlog, upload };
