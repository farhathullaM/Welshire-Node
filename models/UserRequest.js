import mongoose from "mongoose";

const userRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  qualification: { type: String, required: true },
  interestedArea: { type: String, required: true },
  preferredCourse: String,
  budget: Number,
  countryPreference: String,
  preferredMode: { type: String, enum: ["Online", "Offline", "Hybrid"] },
  languagePreference: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserRequest", userRequestSchema);
