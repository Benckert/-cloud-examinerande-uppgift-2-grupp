import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { entriesApi } from "@/lib/api/entries";
import { usersApi } from "@/lib/api/users";
import { act } from "react";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock API calls
jest.mock("@/lib/api/entries");
jest.mock("@/lib/api/users");

describe("DashboardPage - search functionality", () => {
  const mockEntries = [
    {
      _id: "1",
      title: "Happy Day",
      content: "It was a happy day",
      tags: ["happy"],
      created_at: "2025-11-10T13:10:00",
    },
    {
      _id: "2",
      title: "Sad Night",
      content: "It was a sad night",
      tags: ["sad"],
      created_at: "2025-11-09T21:00:00",
    },
  ];

  beforeEach(() => {
    (usersApi.getCurrentUser as jest.Mock).mockResolvedValue({
      name: "Test User",
    });
    (entriesApi.getAll as jest.Mock).mockResolvedValue(mockEntries);
    (entriesApi.search as jest.Mock).mockResolvedValue([]);
    jest.clearAllMocks();
  });

  it("renders all entries initially", async () => {
    await act(async () => {
      render(<DashboardPage />);
    });

    const searchInput = await screen.findByRole("textbox", {
      name: /search journal entries/i,
    });

    // Ensure entries are displayed
    expect(screen.getByText("Happy Day")).toBeInTheDocument();
    expect(screen.getByText("Sad Night")).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
  });

  it("updates entries based on search query", async () => {
    (entriesApi.search as jest.Mock).mockResolvedValue([mockEntries[0]]);

    await act(async () => {
      render(<DashboardPage />);
    });

    const searchInput = await screen.findByRole("textbox", {
      name: /search journal entries/i,
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Happy" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Happy Day")).toBeInTheDocument();
      expect(screen.queryByText("Sad Night")).not.toBeInTheDocument();
    });
  });

  it("shows no results message if search finds nothing", async () => {
    (entriesApi.search as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<DashboardPage />);
    });

    const searchInput = await screen.findByRole("textbox", {
      name: /search journal entries/i,
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear search/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/No entries found matching/i)
      ).toBeInTheDocument();
    });
  });

  it("clears search and reloads all entries", async () => {
    (entriesApi.search as jest.Mock).mockResolvedValue([]);
    (entriesApi.getAll as jest.Mock).mockResolvedValue(mockEntries);

    await act(async () => {
      render(<DashboardPage />);
    });

    const searchInput = await screen.findByRole("textbox", {
      name: /search journal entries/i,
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
    });

    const clearBtn = await screen.findByRole("button", {
      name: /clear search/i,
    });

    await act(async () => {
      fireEvent.click(clearBtn);
    });

    await waitFor(() => {
      // After clearing search, both entries should be visible again
      expect(screen.getByText("Happy Day")).toBeInTheDocument();
      expect(screen.getByText("Sad Night")).toBeInTheDocument();
      expect(searchInput).toHaveValue("");
    });
  });
});
