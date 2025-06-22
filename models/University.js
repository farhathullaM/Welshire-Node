import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["indian", "abroad"],
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
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

export default mongoose.model("University", universitySchema);
