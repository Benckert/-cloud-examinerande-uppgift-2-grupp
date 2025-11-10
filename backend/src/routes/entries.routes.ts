import { Router } from "express";
import {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
} from "../controllers/entries.controllers.js"
import { auth } from "../middleware/auth.middleware.js"
const router = Router()

// Search entries - must come before /:id route
router.get("/search", auth, searchEntries)

// Standard CRUD operations
router.get("/", auth, getEntries)
router.get("/:id", auth, getEntry)
router.post("/", auth, createEntry)
router.put("/:id", auth, updateEntry)
router.delete("/:id", auth, deleteEntry)

export default router;
