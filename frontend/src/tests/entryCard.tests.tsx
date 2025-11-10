import {render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntryCard from "@/components/EntryCard";
import { moodOptions } from "@/lib/moods/moodOptions";

describe("EntryCard Component", () => {
    const mockEntry = {
        _id: "123",
        title: "Test Entry",
        content: "Test Content",
        tags: "happy",
        createdAt: new Date().toISOString(),
        createdBy: "user123",
        updatedAt: new Date().toISOString()
    };

    const mockOnDelete = jest.fn();

    it("renders entry details correctly", () => {
        render(<EntryCard entry={mockEntry} onDelete={mockOnDelete} /> );

        expect(screen.getByText("Test Entry")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
        expect(screen.getByText("happy")).toBeInTheDocument();
        
    })
})