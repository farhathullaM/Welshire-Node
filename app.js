import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDb from "./config/dbConnection.js";
import contactRoutes from "./routes/contact.js";
import universityRoutes from "./routes/university.js";
import courseRoutes from "./routes/course.js";
import faqRoutes from "./routes/faq.js";
import applyRoutes from "./routes/apply.js";
import blogRoutes from "./routes/blog.js";
import testimonialRoutes from "./routes/testimonial.js";
import userRoutes from "./routes/user.js";
import publicRoutes from "./routes/public.js";
import suggestionRoutes from "./routes/suggest.js";

dotenv.config();
connectDb();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/contact", contactRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/suggest", suggestionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
