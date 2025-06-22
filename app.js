import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/dbConnection.js";
import contactRoutes from "./routes/contact.js";
import universityRoutes from "./routes/university.js";
import courseRoutes from './routes/course.js'

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/course', courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
