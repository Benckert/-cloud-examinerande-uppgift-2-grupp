import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntryCard from "@/components/EntryCard";
import { moodOptions } from "@/lib/moods/moodOptions";

jest.mock("@/lib/api/entries", () => ({
  entriesApi: {
    delete: jest.fn().mockResolvedValue({}), // mockar bort felet
  },
}));

describe("EntryCard Component", () => {
  const mockEntry = {
    _id: "123",
    title: "Test Entry",
    content: "Test Content",
    tags: "happy",
    createdAt: new Date().toISOString(),
    createdBy: "user123",
    updatedAt: new Date().toISOString(),
  };

  const mockOnDelete = jest.fn();

  it("renders entry details correctly", () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test Entry")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("happy")).toBeInTheDocument();
  });
  it("displayes correct mood emoji", () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);
    const emoji = moodOptions.find((m) => m.value === "happy")?.emoji;

    expect(screen.getByText(emoji as string)).toBeInTheDocument();
  });
  it("calls onDelete when delete button is clicked", async () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith("123");
    });
  });
});
