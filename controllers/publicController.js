import asyncHandler from "express-async-handler";
import University from "../models/University.js";
import Course from "../models/Course.js";

const getUniversityList = asyncHandler(async (req, res) => {
  const universities = await University.find({}).select("name");
  res.status(200).send(universities);
});

const getUniversityDetails = asyncHandler(async (req, res) => {
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

export { getUniversityList, getUniversityDetails };
