import asyncHandler from "express-async-handler";
import Contact from "../models/Contact.js";

const getAllContacts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ],
  };

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(query).skip(skip).limit(Number(limit));

  const total = await Contact.countDocuments(query);

  res.status(200).json({ contacts, total, page, limit });
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error("Name and phone number is mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    message,
  });
  res
    .status(201)
    .json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  await contact.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, data: contact });
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});

const resolveContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    { resolved: true },
    { new: true }
  );
  res.status(200).json(updatedContact);
});

export {
  getAllContacts,
  createContact,
  getContact,
  deleteContact,
  updateContact,
  resolveContact,
};
