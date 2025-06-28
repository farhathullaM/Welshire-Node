import asyncHandler from "express-async-handler";
import Faq from "../models/Faq.js";

const addFaq = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    res.status(400);
    throw new Error("Question and answer is mandatory");
  }
  const faq = await Faq.create({
    question,
    answer,
  });
  res.status(201).json(faq);
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error("Faq not found");
  }
  const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedFaq);
});

const getAllFaqs = asyncHandler(async (req, res) => {
  const faqs = await Faq.find({});
  res.status(200).send(faqs);
});

const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error("Faq not found");
  }
  await Faq.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Faq deleted successfully" });
});

const trashFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error("Faq not found");
  }
  const trash = await Faq.findByIdAndUpdate(
    req.params.id,
    { trash: true },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Faq moved to trash" });
});

export { addFaq, updateFaq, getAllFaqs, deleteFaq, trashFaq };
