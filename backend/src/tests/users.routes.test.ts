import { Request, Response } from "express";
import { UserModel } from "../models/user.models.js";
// import "@testing-library/jest-dom";
import {
  //   createUser,
  userLogin,
  //   getAllUsers,
  //   getUserById,
  //   updateUserById,
  //   deleteUserById,
} from "../controllers/users.controllers.js";
// import { body } from "framer-motion/client";

jest.mock("../models/user.models.js");

describe("User Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("userLogin", () => {
    it("should login a user successfully", async () => {
      mockRequest.body = {
        email: "jane@test.com",
        passwordHash: "hej123",
      };
      const mockUser = {
        email: "jane@test.com",
        passwordHash: "$2a$10$hashedPassword",
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      await userLogin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Login successful" })
      );
    });
  });
});
