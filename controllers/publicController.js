import asyncHandler from "express-async-handler";
import University from "../models/University.js";
import Course from "../models/Course.js";
import Faq from "../models/Faq.js";
import Testimonial from "../models/Testimonial.js";
import Blog from "../models/Blog.js";

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

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.find({});
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).send(course);
});

const getFaqs = asyncHandler(async (req, res) => {
  const faq = await Faq.find({});
  if (!faq) {
    res.status(404);
    throw new Error("Faq not found");
  }
  res.status(200).send(faq);
});

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.find({});
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  res.status(200).send(testimonial);
});

const getBlogs = asyncHandler(async (req, res) => {
  const blog = await Blog.find({});
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).send(blog);
});

export {
  getUniversityList,
  getUniversityDetails,
  getCourse,
  getFaqs,
  getTestimonials,
  getBlogs,
};
