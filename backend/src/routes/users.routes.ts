import { Router } from "express";
import express from "express"
import { createUser, userLogin, getAllUsers, getUserById, updateUserById, deleteUserById } from "../controllers/users.controllers.js"

const router = express.Router();

router.post("/register", createUser);
router.post("/login", userLogin);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;