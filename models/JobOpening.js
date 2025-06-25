import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    salary: {
      type: String,
    },
    jobType: {
      type: String,
    },
    experience: {
      type: String,
    },
    skills: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JobOpening", jobOpeningSchema);
