import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorDisplay } from "../ErrorDisplay";
import type { ForecastErrorResponse } from "@/types/forecast";

describe("ErrorDisplay", () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    mockOnDismiss.mockClear();
  });

  it("renders error message for string error", () => {
    render(
      <ErrorDisplay error="Test error message" onDismiss={mockOnDismiss} />
    );

    expect(screen.getByText("Address Error")).toBeDefined();
    expect(screen.getByText("Test error message")).toBeDefined();
  });

  it("renders error message for error object", () => {
    const errorObject: ForecastErrorResponse = {
      error: "Custom error message",
      suggestions: ["Try suggestion 1", "Try suggestion 2"],
    };

    render(<ErrorDisplay error={errorObject} onDismiss={mockOnDismiss} />);

    expect(screen.getByText("Address Error")).toBeDefined();
    expect(screen.getByText("Custom error message")).toBeDefined();
  });

  it("renders suggestions when provided", () => {
    const errorObject: ForecastErrorResponse = {
      error: "Test error",
      suggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    };

    render(<ErrorDisplay error={errorObject} onDismiss={mockOnDismiss} />);

    expect(screen.getByText("Try these suggestions:")).toBeDefined();
    expect(screen.getByText("Suggestion 1")).toBeDefined();
    expect(screen.getByText("Suggestion 2")).toBeDefined();
    expect(screen.getByText("Suggestion 3")).toBeDefined();
  });

  it("does not render suggestions section for string error", () => {
    render(<ErrorDisplay error="Simple error" onDismiss={mockOnDismiss} />);

    expect(screen.queryByText("Try these suggestions:")).toBeNull();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);

    const dismissButton = screen.getByText("Dismiss");
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("handles error object without suggestions", () => {
    const errorObject: ForecastErrorResponse = {
      error: "Error without suggestions",
    };

    render(<ErrorDisplay error={errorObject} onDismiss={mockOnDismiss} />);

    expect(screen.getByText("Error without suggestions")).toBeDefined();
    expect(screen.queryByText("Try these suggestions:")).toBeNull();
  });

  it("handles error object with empty error message", () => {
    const errorObject: ForecastErrorResponse = {
      error: "",
      suggestions: ["Some suggestion"],
    };

    render(<ErrorDisplay error={errorObject} onDismiss={mockOnDismiss} />);

    expect(screen.getByText("An error occurred")).toBeDefined();
  });
});
