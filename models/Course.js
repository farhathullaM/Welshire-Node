import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    university_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    duration: { type: String },
    fees: { type: String },
    eligibility: { type: String },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
      required: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
