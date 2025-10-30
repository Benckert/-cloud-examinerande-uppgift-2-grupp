import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

await connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}).catch((err: any) => {
    console.log("Error connecting to MongoDB ", err);
});

