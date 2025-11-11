import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EntryModel, Entry } from "../models/entry.models.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { createdBy } = req.body;
    if (!createdBy) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    // Hämta de 10 senaste inläggen
    const entries: Entry[] = await EntryModel.find({ createdBy })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!entries.length) {
      res.status(404).json({ error: "No entries found for this user" });
      return;
    }

    // Skapa texten med de 10 senaste inläggen
    const text = entries
      .map(
        (e, i) => `Entry ${i + 1}:\nTitle: ${e.title}\n${e.content}`
      )
      .join("\n\n");

    // Skapa prompt
    const prompt = `
You are a reflective and positive journaling coach.
Analyze the following 10 diary entries and give personalized feedback:
- recurring emotions or themes
- possible insights or advice
- end with a short encouraging note.

${text}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Gemini kräver "contents" i generateContent()
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const feedback = result.response.text();
    res.json({ feedback });
  } catch (err) {
    console.error("AI Summary Error:", err);
    res.status(500).json({ error: "Failed to generate AI feedback" });
  }
};