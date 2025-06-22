import { render, screen, fireEvent } from "@testing-library/react";
import { WorkingExamples } from "../WorkingExamples";

describe("WorkingExamples", () => {
  const mockOnExampleClick = jest.fn();

  beforeEach(() => {
    mockOnExampleClick.mockClear();
  });

  it("renders the heading text", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    expect(screen.getByText("Try these working examples:")).toBeDefined();
  });

  it("renders all example addresses as buttons", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    expect(
      screen.getByText("1600 Pennsylvania Avenue, Washington, DC")
    ).toBeDefined();

    expect(
      screen.getByText("350 Fifth Avenue, New York, NY 10118")
    ).toBeDefined();

    expect(
      screen.getByText("100 Universal City Plaza, Universal City, CA")
    ).toBeDefined();
    expect(screen.getByText("1000 Fifth Avenue, New York, NY")).toBeDefined();
  });

  it("calls onExampleClick when an example address is clicked", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    const firstExample = screen.getByText(
      "1600 Pennsylvania Avenue, Washington, DC"
    );

    fireEvent.click(firstExample);

    expect(mockOnExampleClick).toHaveBeenCalledWith(
      "1600 Pennsylvania Avenue, Washington, DC"
    );

    expect(mockOnExampleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onExampleClick with correct address for each example", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    const examples = [
      {
        text: "1600 Pennsylvania Avenue, Washington, DC",
        address: "1600 Pennsylvania Avenue, Washington, DC",
      },
      {
        text: "350 Fifth Avenue, New York, NY 10118",
        address: "350 Fifth Avenue, New York, NY 10118",
      },
      {
        text: "100 Universal City Plaza, Universal City, CA",
        address: "100 Universal City Plaza, Universal City, CA",
      },
      {
        text: "1000 Fifth Avenue, New York, NY",
        address: "1000 Fifth Avenue, New York, NY",
      },
    ];

    examples.forEach(({ text, address }) => {
      const button = screen.getByText(text);
      fireEvent.click(button);
      expect(mockOnExampleClick).toHaveBeenCalledWith(address);
    });

    expect(mockOnExampleClick).toHaveBeenCalledTimes(4);
  });

  it("renders buttons with proper hover styles", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button.className).toContain("hover:text-blue-900");
      expect(button.className).toContain("hover:underline");
    });
  });

  it("renders in a blue-themed container", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    const container = document.querySelector(".bg-blue-50");
    expect(container).toBeDefined();
  });

  it("renders lightbulb and map pin icons", () => {
    render(<WorkingExamples onExampleClick={mockOnExampleClick} />);

    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBe(5);
  });
});
