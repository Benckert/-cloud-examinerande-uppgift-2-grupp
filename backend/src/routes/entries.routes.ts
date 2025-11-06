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

router.get("/", auth, getEntries /* , authenticateUser */);
router.get("/:id", getEntry /* , authenticateUser */);
router.post("/", createEntry /* , authenticateUser */);
router.put("/:id", updateEntry /* , authenticateUser */);
router.delete("/:id", deleteEntry /* , authenticateUser */);

export default router;
