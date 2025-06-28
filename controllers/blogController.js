import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { deleteFileWithFolderName } from "../helpers/fileDelete.js";

const uploadPath = path.join("uploads", "blog");
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

const addBlog = asyncHandler(async (req, res) => {
  const { title, description, author } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description is mandatory");
  }

  let imageName = null;
  if (req.file) {
    imageName = req.file.filename;
  }

  const blog = await Blog.create({
    title,
    description,
    image: imageName,
    author,
  });
  res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).send(blogs);
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).send(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  if (blog.image) {
    await deleteFileWithFolderName(uploadPath, blog.image);
  }
  await Blog.findByIdAndDelete(req.params.id);
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

  let newImageName = null;
  if (req.file) {
    if (blog.image) {
      await deleteFileWithFolderName(uploadPath, blog.image);
    }
    newImageName = req.file.filename;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { ...updateData, image: newImageName },
    { new: true }
  );
  res.status(200).json(updatedBlog);
});

export { addBlog, getAllBlogs, getBlog, deleteBlog, updateBlog, upload };
