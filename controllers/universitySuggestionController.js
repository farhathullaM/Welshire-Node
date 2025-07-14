import asyncHandler from "express-async-handler";
import UserRequest from "../models/UserRequest.js";
// import University from "../models/University.js";

const suggestUniversities = asyncHandler(async (req, res) => {
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
    message: "Request submitted successfully",
    success: true,
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

const getAllSuggestions = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { interestedArea: { $regex: search, $options: "i" } },
      { qualification: { $regex: search, $options: "i" } },
    ],
  };

  const skip = (page - 1) * limit;

  const suggestions = await UserRequest.find(query)
    .skip(skip)
    .limit(Number(limit));

  const total = await UserRequest.countDocuments(query);

  res.status(200).json({
    suggestions,
    total,
    page,
    limit,
  });
});

const deleteSuggestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const suggestion = await UserRequest.findByIdAndDelete(id);
  if (!suggestion) {
    res.status(404);
    throw new Error("Suggestion not found");
  }
  res.status(200).json({ message: "Suggestion deleted successfully" });
});

export { suggestUniversities, getAllSuggestions, deleteSuggestion };
