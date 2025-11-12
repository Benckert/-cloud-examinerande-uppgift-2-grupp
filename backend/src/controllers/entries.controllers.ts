import { Request, Response } from "express";
import mongoose from "mongoose";
import { EntryModel } from "../models/entry.models.js";
import entryValidation from "../validation/entry.validate.js"

export const getEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) throw new Error("User ID not found in request");

    const entries = await EntryModel.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ data: entries });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch journal entries",
      details: (err as Error).message,
    });
  }
};

export const getEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    const entry = await EntryModel.findById(id);

    if (!entry) return res.status(404).json({ error: "Entry not found" });
    // if(entry.createdBy.toString() !== userId) {
    //   return res.status(403).json({ error: "Not authorized to view this entry" });
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch journal entry",
      details: (err as Error).message,
    });
  }
};

export const createEntry = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    // TODO När vi har auth på plats
    const userId = (req as any).userId;
    if (!userId) throw new Error("User not authenticated");

    // if(!createdBy) return res.status(401).json({ error: "User not authenticated" });

    const newEntry = new EntryModel({
      title,
      content,
      tags,
      createdBy: userId,
    });

    // Validera task input
    const parsed = entryValidation.safeParse(req.body);
        
    if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed. ", details: parsed.error });
    };

    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create journal entry",
      details: (err as Error).message,
    });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO När vi har auth på plats
    // const userId = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    const existingEntry = await EntryModel.findById(id);
    if (!existingEntry)
      return res.status(404).json({ error: "Entry not found" });

    // if(existingEntry.createdBy.toString() !== userId) {
    //   return res.status(403).json({ error: "Not authorized to update this entry" });
    // }

    // Partial validering ifall man bara ändrar ett fält
    const parsed = entryValidation.partial().safeParse(req.body);
        
    if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed. ", details: parsed.error });
    };

    const updatedEntry = await EntryModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update journal entry",
      details: (err as Error).message,
    });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO När vi har auth på plats
    // const userId = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    const existingEntry = await EntryModel.findById(id);
    if (!existingEntry)
      return res.status(404).json({ error: "Entry not found" });

    // if(existingEntry.createdBy.toString() !== userId) {
    //   return res.status(403).json({ error: "Not authorized to delete this entry" });

    const entry = await EntryModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Journal entry deleted successfully", entry });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete journal entry",
      details: (err as Error).message,
    });
  }
};

export const searchEntries = async (req: Request, res: Response) => {
  try {
    // Extract the authenticated user ID from the request (set by auth middleware)
    const userId = (req as any).userId;
    if (!userId) throw new Error("User ID not found in request");

    // Get the search query from URL parameters
    const { query } = req.query;

    // Validate that a search query was provided
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Search query is required",
        message: "Please provide a 'query' parameter with your search term",
      });
    }

    // Trim whitespace from the search query
    const searchQuery = query.trim();

    // If search query is empty after trimming, return validation error
    if (searchQuery.length === 0) {
      return res.status(400).json({
        error: "Search query cannot be empty",
        message: "Please provide a non-empty search term",
      });
    }

    // Search for entries matching the query in title OR content
    // $regex: performs pattern matching (case-insensitive with 'i' option)
    // $or: matches if ANY of the conditions are true
    // Only searches entries created by the authenticated user
    const entries = await EntryModel.find({
      createdBy: userId,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 }); // Sort by newest first

    // Return the matching entries
    res.status(200).json({
      data: entries,
      count: entries.length,
      query: searchQuery,
    });
  } catch (err) {
    // Handle any errors that occur during the search
    res.status(500).json({
      error: "Failed to search journal entries",
      details: (err as Error).message,
    });
  }
};
