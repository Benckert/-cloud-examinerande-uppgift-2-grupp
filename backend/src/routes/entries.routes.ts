import { Router } from "express";
import {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/entries.controllers.js";
import { auth } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", auth, getEntries );
router.get("/:id", auth, getEntry );
router.post("/", auth, createEntry );
router.put("/:id", auth, updateEntry );
router.delete("/:id", auth, deleteEntry );

export default router;
