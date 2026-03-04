import "dotenv/config"; // ✅ pinakauna
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
const PORT = 5001;

// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRouters from "./routes/authRoutes.js";

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRouters);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handlers
process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  await disconnectDB();
  server.close(() => process.exit(1));
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await disconnectDB();
  server.close(() => process.exit(0));
});