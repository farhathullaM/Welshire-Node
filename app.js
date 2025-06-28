import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/dbConnection.js";
import contactRoutes from "./routes/contact.js";
import universityRoutes from "./routes/university.js";
import courseRoutes from "./routes/course.js";
import faqRoutes from "./routes/faq.js";
import applyRoutes from "./routes/apply.js";
import blogRoutes from "./routes/blog.js";
import testimonialRoutes from "./routes/testimonial.js";
import userRoutes from "./routes/user.js";

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
