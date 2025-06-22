import { render, screen, fireEvent } from "@testing-library/react";
import { AddressForm } from "../AddressForm";

describe("AddressForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form elements correctly", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByRole("textbox")).toBeDefined();
    expect(screen.getByRole("button", { name: "Get Forecast" })).toBeDefined();
  });

  it("shows placeholder text", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByPlaceholderText(/Enter an address/);
    expect(input).toBeDefined();
  });

  it("calls onSubmit when form is submitted with valid address", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Get Forecast" });

    fireEvent.change(input, { target: { value: "123 Main St" } });
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith("123 Main St");
  });

  it("does not call onSubmit when address is empty", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const button = screen.getByRole("button", { name: "Get Forecast" });
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("trims whitespace from address before submitting", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Get Forecast" });

    fireEvent.change(input, { target: { value: "   123 Main St   " } });
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith("123 Main St");
  });

  it("shows loading state when loading is true", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={true} />);

    expect(screen.getByText("Loading...")).toBeDefined();
    expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("disables button when address is empty", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const button = screen.getByRole("button");
    expect(button).toHaveProperty("disabled", true);
  });

  it("enables button when address is not empty", () => {
    render(<AddressForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "123 Main St" } });

    expect(button).toHaveProperty("disabled", false);
  });
});
