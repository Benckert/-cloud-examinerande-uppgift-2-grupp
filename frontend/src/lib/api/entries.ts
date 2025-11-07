import { Entry } from "@/types/database.types";
import { API_BASE_URL } from "./api_url";

export const entriesApi = {
  async getAll(): Promise<Entry[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/entries`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entries");
    }

    const json = await response.json();
    return json.data;
  },
  async getOne(id: string): Promise<Entry> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch the entry");
    }
    return response.json();
  },
  async create(entry: {
    title: string;
    content: string;
    tags?: string;
  }): Promise<Entry> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error("Failed to create the entry");
    }
    return response.json();
  },
  async update(
    id: string,
    entry: { title: string; content: string; tags?: string }
  ): Promise<Entry> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error("Failed to update the entry");
    }
    return response.json();
  },
  async delete(id: string): Promise<Entry> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete the entry");
    }
    return response.json();
  },
};
