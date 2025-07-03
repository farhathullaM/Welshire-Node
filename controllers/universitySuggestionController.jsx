import asyncHandler from "express-async-handler";
import UserRequest from "../models/UserRequest.js";
import University from "../models/University.js";

export const suggestUniversities = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    qualification,
    interestedArea,
    preferredCourse,
    budget,
    countryPreference,
    preferredMode,
    languagePreference,
  } = req.body;

  if (!name || !qualification || !interestedArea) {
    res.status(400);
    throw new Error("Required fields missing");
  }

  // Store the user request
  await UserRequest.create({
    name,
    phone,
    email,
    qualification,
    interestedArea,
    preferredCourse,
    budget,
    countryPreference,
    preferredMode,
    languagePreference,
  });

  res.status(201).json({
    message: "User request created",
    data: {
      name,
      phone,
      email,
      qualification,
      interestedArea,
      preferredCourse,
      budget,
      countryPreference,
      preferredMode,
      languagePreference,
    },
  });

  //   // Build query for filtering universities
  //   const query = {
  //     ...(interestedArea && { areaOfStudy: interestedArea }),
  //     ...(preferredCourse && { availableCourses: preferredCourse }),
  //     ...(budget && { tuitionFees: { $lte: budget } }),
  //     ...(countryPreference && { location: countryPreference }),
  //     ...(preferredMode && { mode: preferredMode }),
  //     ...(languagePreference && { language: languagePreference }),
  //   };

  //   const universities = await University.find(query).limit(10);
  //   res.json({ message: "Matching universities", data: universities });
});
