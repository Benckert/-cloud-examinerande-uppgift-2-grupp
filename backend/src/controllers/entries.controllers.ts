import { Request, Response } from "express";
import mongoose from "mongoose";
import { JournalModel } from "../models/journal.models.js";

export const getEntries = async (req: Request, res: Response) => {
  try {
    // TODO När vi har auth på plats
    // const userId = req.user?.userId;
    const userId = (req as any).userId;
    if (!userId) throw new Error("User ID not found in request");
    const entries = await JournalModel.find({ createdBy: userId });
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
    // TODO När vi har auth på plats
    // const userId = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    const entry = await JournalModel.findById(id);

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
    const { title, content, tags} = req.body;
    // TODO När vi har auth på plats
      const userId = (req as any).userId;
    if (!userId) throw new Error("User not authenticated");

    // if(!createdBy) return res.status(401).json({ error: "User not authenticated" });

    const newEntry = new JournalModel({
      title,
      content, 
      tags,
      createdBy: userId
    });

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
    const existingEntry = await JournalModel.findById(id);
    if (!existingEntry)
      return res.status(404).json({ error: "Entry not found" });

    // if(existingEntry.createdBy.toString() !== userId) {
    //   return res.status(403).json({ error: "Not authorized to update this entry" });
    // }
    const updatedEntry = await JournalModel.findByIdAndUpdate(id, req.body, {
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
    const existingEntry = await JournalModel.findById(id);
    if (!existingEntry)
      return res.status(404).json({ error: "Entry not found" });

    // if(existingEntry.createdBy.toString() !== userId) {
    //   return res.status(403).json({ error: "Not authorized to delete this entry" });

    const entry = await JournalModel.findByIdAndDelete(id);
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
