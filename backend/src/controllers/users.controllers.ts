import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.models.js";
import type { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const capitalize = <T extends string>(s: T) => {
  if (s.length === 0) return s;
  return (s[0]!.toUpperCase() + s.slice(1).toLowerCase()) as Capitalize<T>;
};

export interface AuthRequest extends Request {
  user?: any;
}

const createJWT = (user: { _id: Types.ObjectId; email: string }): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: "48h" },
  );
};

// CREATE USER - registrera konto, spara i DB
export async function createUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  try {
    //Validering enkel
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Formattera namn och email
    const formattedEmail = email.toLowerCase();
    const formattedName = capitalize(name);

    // Kolla om användaren redan finns
    const existingUser = await UserModel.findOne({ email: formattedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Kryptera lösenord
    const passwordHash = await bcrypt.hash(password, 10);

    // Skapa användare
    const newUser = await UserModel.create({
      email: formattedEmail,
      name: formattedName,
      passwordHash,
    });

    // Skapa token
    const token = createJWT(newUser);

    // Returnera användaren utan passwordHash
    res.status(201).json({
      message: "User created successfully",
      token,
      data: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to create user. ${error}`,
    });
  }
}

// GET USER - LOGIN
export async function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    //Validering enkel
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Formattera email
    const formattedEmail = email.toLowerCase();

    // Hitta att user finns via email
    const user = await UserModel.findOne({
      email: formattedEmail,
    });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Kontrollera lösenordet
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Skapa token
    const token = createJWT(user);

    const { _id, name, email: userEmail } = user;
    res.status(200).json({
      message: "Login successful",
      token,
      data: { _id, name, email: userEmail },
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to login user. ${error}`,
    });
  }
}

// GET ALL USERS - TODO: lägg til JWT för auth?
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find().select("-passwordHash");

    if (!users) {
      return res
        .status(404)
        .json({ message: "The requested response does not exist." });
    }

    res.status(200).json({ message: "Fetched all users:", data: users });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to fetch all users. ${error}`,
    });
  }
}

// GET USER BY ID
export async function getUserById(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id).select(
      "-passwordHash",
    );

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res.status(200).json({ message: "Fetched user:", data: user });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to fetch user. ${error}`,
    });
  }
}

// UPDATE USER
export async function updateUserById(req: Request, res: Response) {
  try {
    // Om nytt namn anges, formattera
    if (req.body.name) {
      req.body.name = capitalize(req.body.name);
    }

    // Om ny email anges, formattera
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    /* TODO: validering? */

    // Kryptera nytt lösenord
    if (req.body.passwordHash) {
      req.body.passwordHash = await bcrypt.hash(req.body.passwordHash, 10);
    }

    // Uppdatera användare
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res.status(201).json({ message: "User updated", data: user });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to update user. ${error}`,
    });
  }
}

//DELETE USER BY ID
export async function deleteUserById(req: Request, res: Response) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id).select(
      "-passwordHash",
    );

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res
      .status(200)
      .json({ message: "Successfully deleted user: ", data: user });
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to delete user. ${error}`,
    });
  }
}

// GET CURRENT USER
export async function getCurrentUser(req: AuthRequest, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) throw new Error("User ID not found in request");

    const user = await UserModel.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `Internal server error. Failed to fetch user. ${error}`,
    });
  }
}
