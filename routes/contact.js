import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  resolveContact,
  updateContact,
} from "../controllers/contactController.js";
const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.get("/:id", getContact);
router.delete("/:id", deleteContact);
router.put("/:id", updateContact);
router.patch("/resolve/:id", resolveContact);

export default router;
