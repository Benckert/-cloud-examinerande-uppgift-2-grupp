import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EntryModel, Entry } from "../models/entry.models.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) throw new Error("User ID not found in request");

    // Hämta de 10 senaste inläggen
    const entries: Entry[] = await EntryModel.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!entries.length) {
      res.status(404).json({ error: "No entries found for this user" });
      return;
    }

    // Skapa texten med de 10 senaste inläggen
    const text = entries
      .map((e, i) => `Entry ${i + 1}:\nTitle: ${e.title}\n${e.content}`)
      .join("\n\n");

    // Skapa prompt
    const prompt = `
Du är en positiv och reflekterande journaling-coach. 
Analysera följande dagboksinlägg som en helhet. 
Ge en **kort sammanfattande feedback på svenska** (1–2 meningar) som fokuserar på de viktigaste teman eller känslor som återkommer, och inkludera gärna ett uppmuntrande råd eller tips. 
Skriv **inte feedback per inlägg**, utan en generell summering.

Dagboksinlägg:
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
