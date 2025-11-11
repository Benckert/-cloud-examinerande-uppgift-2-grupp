import express from "express";
import {
  createUser,
  userLogin,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getCurrentUser,
} from "../controllers/users.controllers.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", userLogin);
router.get("/me", auth, getCurrentUser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
