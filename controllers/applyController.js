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
  const applies = await Apply.find({});
  res.status(200).send(applies);
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
