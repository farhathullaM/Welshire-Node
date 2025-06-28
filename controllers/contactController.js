import asyncHandler from "express-async-handler";
import Contact from "../models/Contact.js";

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.status(200).send(contacts);
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
  res.status(201).json(contact);
});

const getContact = asyncHandler(async (req, res) => {
  console.log(req.params.id);
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
  resolveContact
};
