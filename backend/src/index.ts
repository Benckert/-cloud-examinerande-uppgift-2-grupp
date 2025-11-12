import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import mongoose from "mongoose";

import aiRouter from "./routes/ai.routes.js";
import entriesRoutes from "./routes/entries.routes.js";
import userRoutes from "./routes/users.routes.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (two levels up from dist/index.js)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://dagboken-frontend.onrender.com", // Frontend production server
          ]
        : [
            "http://localhost:3001", // Frontend development server
            "http://localhost:3000", // Backend development server
            "http://127.0.0.1:3001", // Frontend development server (IPv4)
            "http://127.0.0.1:3000", // Backend development server (IPv4)
          ],
    credentials: true,
  }),
);
app.use(express.json());

// Health check endpoint - useful for Docker healthchecks and CI/CD
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "OK",
    version: "1.0.1",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  // Return 503 if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      ...healthStatus,
      status: "UNHEALTHY",
    });
  }

  res.status(200).json(healthStatus);
});

app.use("/entries", entriesRoutes);
app.use("/users", userRoutes);
app.use("/api", aiRouter);

const PORT = process.env.PORT || 3000;

await connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB ", err);
  });
