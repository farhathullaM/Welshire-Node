import asyncHandler from "express-async-handler";
import University from "../models/University.js";

const addUniversity = asyncHandler(async (req, res) => {
  const { name, type, description, image } = req.body;
  if (!name || !type) {
    res.status(400);
    throw new Error("Name and type is mandatory");
  }
  const university = await University.create({
    name,
    type,
    description,
    image,
  });
  res.status(201).json(university);
});

const getAllUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({});
  res.status(200).send(universities);
});

const getUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }
  res.status(200).json(university);
});

const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }
  await university.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, data: university });
});

const updateUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }
  const updatedUniversity = await University.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedUniversity);
});

export { addUniversity, getAllUniversities, deleteUniversity, getUniversity, updateUniversity };
