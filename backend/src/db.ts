import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDb() {
    if(!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "dagboken"
        })
        console.log("Connected to MongoDb")
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}