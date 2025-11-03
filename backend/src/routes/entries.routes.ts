import { Router } from "express";
import { getEntries, getEntry, createEntry, updateEntry, deleteEntry } from "../controllers/entries.controllers.js";
// import { authenticateUser } from "../middleware/auth.middleware.ts";
const router = Router();

router.get("/", getEntries /* , authenticateUser */);
router.get("/:id", getEntry /* , authenticateUser */);
router.post("/", createEntry /* , authenticateUser */);
router.put("/:id", updateEntry /* , authenticateUser */);
router.delete("/:id", deleteEntry /* , authenticateUser */);

export default router;