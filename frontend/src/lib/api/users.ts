import { User } from "@/types/database.types";
import { API_BASE_URL } from "./api_url";

export const usersApi = {
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create the user");
    }
    return response.json();
  },
  async signIn(userData: { email: string; password: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to login user");
    }
    return response.json();
  },
};
