import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
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
import { authorizeRoles, protect } from "./middleware/auth.js";

dotenv.config();
connectDb();

const app = express();
const __dirname = path.resolve();

// app.use(
//   cors({
//     credentials: true,
//     origin: [
//       "http://localhost:5173",
//       "https://www.horizoneducation.in",
//       "http://horizoneducation.in",
//       "https://welshire.in",
//       "http://welshire.in",
//     ],
//   })
// );
app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/api/contact",
  protect,
  authorizeRoles("admin", "super_admin"),
  contactRoutes
);
app.use(
  "/api/university",
  protect,
  authorizeRoles("admin", "super_admin"),
  universityRoutes
);
app.use(
  "/api/course",
  protect,
  authorizeRoles("admin", "super_admin"),
  courseRoutes
);
app.use("/api/faq", protect, authorizeRoles("admin", "super_admin"), faqRoutes);
app.use("/api/apply", applyRoutes);
app.use(
  "/api/blog",
  protect,
  authorizeRoles("admin", "super_admin"),
  blogRoutes
);
app.use(
  "/api/testimonial",
  protect,
  authorizeRoles("admin", "super_admin"),
  testimonialRoutes
);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);
app.use(
  "/api/suggest",
  protect,
  authorizeRoles("admin", "super_admin"),
  suggestionRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
