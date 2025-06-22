import mongoose from "mongoose";

const applySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Apply", applySchema);
