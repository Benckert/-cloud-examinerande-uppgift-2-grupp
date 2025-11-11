import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url"
import { connectDb } from "./db.js"

import entriesRoutes from "./routes/entries.routes.js"
import userControllers from "./routes/users.routes.js"
import aiRouter from "./controllers/ai.routes.js"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root (two levels up from dist/index.js)
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const app = express();

app.use(cors());
app.use(express.json());
app.use("/entries", entriesRoutes);
app.use("/users", userControllers);
app.use("/ai-summary", aiRouter);

const PORT = process.env.PORT || 3000

await connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.log("Error connecting to MongoDB ", err);
  });
