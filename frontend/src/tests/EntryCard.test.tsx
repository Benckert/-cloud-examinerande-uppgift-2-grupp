import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntryCard from "@/components/EntryCard";

jest.mock("@/lib/api/entries", () => ({
  entriesApi: {
    delete: jest.fn().mockResolvedValue({}), // mockar bort felet
    update: jest.fn().mockResolvedValue({}), // låtsas att API:t lyckas
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
  const mockOnUpdate = jest.fn();

  it("renders entry details correctly", () => {
    render(
      <EntryCard
        entry={mockEntry}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("Test Entry")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("happy")).toBeInTheDocument();
  });
  it("shows correct mood emoji", () => {
    render(
      <EntryCard
        entry={mockEntry}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("😁")).toBeInTheDocument();
  });
  it("shows default emoji when tag is missing", () => {
    const entryWithoutTag = { ...mockEntry, tags: "neutral" };
    render(
      <EntryCard
        entry={entryWithoutTag}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("😐")).toBeInTheDocument();
  });
  it("calls onDelete when delete button is clicked", async () => {
    render(
      <EntryCard
        entry={mockEntry}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: /delete entry/i });
    fireEvent.click(deleteBtn);

    // Klicka även på bekräftelsen i modalen
    fireEvent.click(screen.getByRole("button", { name: /yes, i'm sure/i }));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith("123");
    });
  });
  it("displays formatted date correctly", () => {
    render(
      <EntryCard
        entry={mockEntry}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

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
  it("allows editing an entry and calls onUpdate", async () => {
    render(
      <EntryCard
        entry={mockEntry}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // Klicka på edit-knappen
    const editButton = screen.getByRole("button", { name: /edit entry/i }); // eller screen.getAllByRole("button")[0]
    fireEvent.click(editButton);

    // Fyll i nya värden
    const titleInput = screen.getByLabelText(/title/i);
    const contentTextarea = screen.getByLabelText(/content/i);
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.change(contentTextarea, { target: { value: "Updated Content" } });

    // Klicka på Save Changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith("123", {
        title: "Updated Title",
        content: "Updated Content",
        tags: "happy",
      });
    });
  });
});

//3. Testa filtrering/sökning av entries
//4. Testa att edit-knappen fungerar
