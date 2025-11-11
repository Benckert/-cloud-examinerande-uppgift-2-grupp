import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewEntryPage from "@/app/new-entry/page";

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

jest.mock("@/lib/api/users", () => ({
  usersApi: {
    getCurrentUser: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ name: "Test User" })),
  },
}));

jest.mock("@/lib/api/entries", () => ({
  entriesApi: {
    create: jest.fn().mockResolvedValue({}),
  },
}));

describe("New Entry Form", () => {
  it("renders all input fields and buttons", async () => {
    render(<NewEntryPage />);

    await waitFor(() => screen.getByLabelText(/title/i));

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/how are you feeling/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save-entry/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("submits the form and navigates to dashboard", async () => {
    render(<NewEntryPage />);

    await waitFor(() => screen.getByLabelText(/title/i));

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "My title" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "My content" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save-entry/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });

  it("calls router.back when cancel button is clicked", async () => {
    render(<NewEntryPage />);

    await waitFor(() => screen.getByRole("button", { name: /cancel/i }));

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("updates mood when a different option is selected", async () => {
    render(<NewEntryPage />);

    await waitFor(() => screen.getByLabelText(/how are you feeling/i));

    const select = screen.getByLabelText(/how are you feeling/i);
    fireEvent.change(select, { target: { value: "happy" } });
    expect(select).toHaveValue("happy");
  });
});
