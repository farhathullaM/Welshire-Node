import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    university: {
      type: String,
    },
    course: {
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

export default mongoose.model("Testimonial", testimonialSchema);
