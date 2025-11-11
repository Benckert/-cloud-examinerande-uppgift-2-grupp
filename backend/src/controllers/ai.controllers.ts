import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EntryModel } from "./models/entry.models.ts"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const aiSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // Hämta de 10 senaste inläggen
    const entries = await Entry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!entries.length) {
      return res.status(400).json({ error: "No entries found for this user" });
    }

    // Skapa prompt till Gemini
    const text = entries
      .map(
        (e, i) => Entry ${i + 1}: ${e.title}\n${e.content}
      )
      .join("\n\n");

    const prompt = 
      You are a reflective and positive journaling coach.
      Analyze the following 10 diary entries and give personalized feedback:
      - recurring emotions or themes
      - possible insights or advice
      - end with a short encouraging note.

      ${text}
    ;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate AI feedback" });
  }
};

export default aiSummary;