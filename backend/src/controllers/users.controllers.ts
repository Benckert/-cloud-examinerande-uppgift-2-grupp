import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/user.models.js";
import type { Types } from "mongoose";

const capitalize = <T extends string>(s: T) => {
  if (s.length === 0) return s;
  return (s[0]!.toUpperCase() + s.slice(1).toLowerCase()) as Capitalize<T>;
};

interface UserInput {
  name: string;
  email: string;
  passwordHash: string;
  _id: Types.ObjectId;
}

const createJWT = (user: UserInput): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: "48h" }
  );
};

// CREATE USER - registrera konto, spara i DB
export async function createUser(req: Request, res: Response) {
  try {
    // Formattera namn och email
    req.body.name = capitalize(req.body.name);
    req.body.email = req.body.email.toLowerCase(); // För att inte ha dubletter av emails genom case insensitivity

    /* TODO: lägg till validering? */

    // Kryptera lösenord
    req.body.passwordHash = await bcrypt.hash(req.body.passwordHash, 10);

    // Skapa användare
    const user = await UserModel.create(req.body);

    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error. Failed to create user. ${error}`,
      });
  }
}

// GET USER - LOGIN
export async function userLogin(req: Request, res: Response) {
  try {
    // Hitta att user finns via email
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
    }).lean();

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Kontrollera lösenordet
    const validPassword = await bcrypt.compare(
      req.body.passwordHash,
      user.passwordHash
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Skapa token
    const token = createJWT(user);

    res
      .status(200)
      .json({ message: "Login successful", token: token, data: user });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error. Failed to login user. ${error}`,
      });
  }
}

// GET ALL USERS - TODO: lägg til JWT för auth?
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find();

    if (!users) {
      return res
        .status(404)
        .json({ message: "The requested response does not exist." });
    }

    res.status(200).json({ message: "Fetched all users:", data: users });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error. Failed to fetch all users. ${error}`,
      });
  }
}

// GET USER BY ID
export async function getUserById(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res.status(200).json({ message: "Fetched user:", data: user });
  } catch (error) {
    res
      .status(500)
      .json({
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
    });

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res.status(201).json({ message: "User updated", data: user });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error. Failed to update user. ${error}`,
      });
  }
}

//DELETE USER BY ID
export async function deleteUserById(req: Request, res: Response) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Requested user does not exist" });
    }

    res
      .status(200)
      .json({ message: "Successfully deleted user: ", data: user });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error. Failed to delete user. ${error}`,
      });
  }
}
