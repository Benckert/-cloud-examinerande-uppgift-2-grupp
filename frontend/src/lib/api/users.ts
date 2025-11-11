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
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.data;
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

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.data;
  },
  async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    return response.json();
  },
};
