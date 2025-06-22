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
    mode: { type: String, enum: ["online", "offline"], required: true },
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
