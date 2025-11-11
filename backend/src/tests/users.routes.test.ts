import { Request, Response } from "express";
import { UserModel } from "../models/user.models.js";
import {
  //   createUser,
  //   userLogin,
  getAllUsers,
  getUserById,
  //   updateUserById,
  //   deleteUserById,
} from "../controllers/users.controllers.js";

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

  describe("getAllUsers", () => {
    it("should return all users with status code 200", async () => {
      // Mocka datan som UserModel.find() ska returnera
      const mockUsers = [
        {
          name: "Test User",
          email: "test@test.com",
          passwordHash: "hashedPassword123",
        },
      ];

      (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Fetched all users:",
        data: mockUsers,
      });
    });
  });

  describe("getUserById", () => {
    it("should return 404 when user does not exist", async () => {
      mockRequest.params = { id: "507f1f77bcf86cd799439011" };
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Requested user does not exist",
      });
    });

    it("should return 200 when user exists", async () => {
      const mockUser = [
        {
          id: "12345",
          name: "Test User",
          email: "test@test.com",
          passwordHash: "hashedPassword123",
        },
      ];

      mockRequest.params = { id: "12345" };
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Fetched user:",
        data: mockUser,
      });
    });
  });
});
