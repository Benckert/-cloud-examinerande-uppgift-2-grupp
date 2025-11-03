import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db.js";
import entriesRoutes from "./routes/entries.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/entries", entriesRoutes);

const PORT = process.env.PORT || 5000;

await connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}).catch((err: any) => {
    console.log("Error connecting to MongoDB ", err);
});

