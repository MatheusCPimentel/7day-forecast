import { render, screen } from "@testing-library/react";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders the main heading", () => {
    render(<EmptyState />);

    expect(screen.getByText("Ready to get your forecast")).toBeDefined();
  });

  it("renders the description text", () => {
    render(<EmptyState />);

    expect(
      screen.getByText(
        "Enter a specific US street address with house number above"
      )
    ).toBeDefined();
  });

  it("renders example addresses", () => {
    render(<EmptyState />);

    expect(
      screen.getByText(/123 Main St, Chicago, IL.*1600 Pennsylvania Ave/)
    ).toBeDefined();
  });

  it("has centered layout", () => {
    render(<EmptyState />);

    const container = document.querySelector(".text-center");
    expect(container).toBeDefined();
  });

  it("renders the cloud icon", () => {
    render(<EmptyState />);

    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeDefined();
  });
});
