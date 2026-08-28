import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import mongoDB from "./Config/mongoDB.js";
import adminRoutes from "./Routes/adminRoutes.js";
import marksRoutes from "./Routes/marksRoute.js";
import blogRoutes from "./Routes/blogRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import enrollmentRoutes from "./Routes/enrollmentRoutes.js";
import reviewRoutes from "./Routes/reviewRoute.js";
import careerRoutes from "./Routes/careerRoutes.js";
import counselingRoutes from "./Routes/counselingRoutes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    "https://teamexcellentcareerinstitute.in",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());



// Database Connection Middleware
const connectDB = async (req, res, next) => {
  try {
    await mongoDB();
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error.message);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
};

app.use(connectDB);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => res.send("Hello from backend!"));
app.use("/api/admin", adminRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/counseling", counselingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Multer upload error', error: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server (only for local development, PORT is set in .env)
const PORT = process.env.PORT || 5000;

// Only call listen if not in a serverless environment (checking for Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless deployment
export default app;
