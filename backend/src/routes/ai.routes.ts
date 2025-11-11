import aiSummary from "../controllers/ai.controllers.js"
import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js"

const router = Router();


router.post("/ai-summary", auth, aiSummary);

export default router;