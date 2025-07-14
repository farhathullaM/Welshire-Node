import asyncHandler from "express-async-handler";
import Apply from "../models/Apply.js";

const addApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, course, message } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error("Name and phone number is mandatory");
  }
  const apply = await Apply.create({
    name,
    email,
    phone,
    course,
    message,
  });
  res.status(201).json(apply);
});

const getAllApplications = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { course: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ],
  };

  const skip = (page - 1) * limit;

  const applications = await Apply.find(query).skip(skip).limit(Number(limit));

  const total = await Apply.countDocuments(query);

  res.status(200).json({
    applications,
    total,
    page,
    limit,
  });
});

const getApplication = asyncHandler(async (req, res) => {
  const apply = await Apply.findById(req.params.id);
  if (!apply) {
    res.status(404);
    throw new Error("Apply not found");
  }
  res.status(200).send(apply);
});

const deleteApplication = asyncHandler(async (req, res) => {
  const apply = await Apply.findById(req.params.id);
  if (!apply) {
    res.status(404);
    throw new Error("Apply not found");
  }
  await Apply.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Apply deleted successfully" });
});

export {
  addApplication,
  getAllApplications,
  getApplication,
  deleteApplication,
};
