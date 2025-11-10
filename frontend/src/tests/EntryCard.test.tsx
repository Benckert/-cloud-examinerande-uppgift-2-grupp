import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntryCard from "@/components/EntryCard";

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
    createdAt: "2025-11-10T12:10:00Z",
    createdBy: "user123",
    updatedAt: "2025-11-10T12:12:00Z",
  };

  const mockOnDelete = jest.fn();

  it("renders entry details correctly", () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test Entry")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("happy")).toBeInTheDocument();
  });
  it("shows correct mood emoji", () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);

    expect(screen.getByText("😁")).toBeInTheDocument();
  });
  it("shows default emoji when tag is missing", () => {
    const entryWithoutTag = { ...mockEntry, tags: "neutral" };
    render(<EntryCard entry={entryWithoutTag} onDelete={mockOnDelete} />);

    expect(screen.getByText("😐")).toBeInTheDocument();
  });
  it("calls onDelete when delete button is clicked", async () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith("123");
    });
  });
  it("displays formatted date correctly", () => {
    render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} />);

    const formattedDate = new Date(mockEntry.createdAt).toLocaleDateString(
      "sv-SE",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});

//3. Testa filtrering/sökning av entries
//4. Testa att edit-knappen fungerar
