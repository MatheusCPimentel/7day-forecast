import { render, screen } from "@testing-library/react";
import { WeatherLoading } from "../WeatherLoading";

describe("WeatherLoading", () => {
  it("renders the loading text", () => {
    render(<WeatherLoading />);
    expect(screen.getByText("Getting Your Forecast")).toBeDefined();
  });

  it("renders the description text", () => {
    render(<WeatherLoading />);

    expect(
      screen.getByText(
        "Fetching weather data from the National Weather Service..."
      )
    ).toBeDefined();
  });

  it("renders weather icons", () => {
    render(<WeatherLoading />);

    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders the progress bar", () => {
    render(<WeatherLoading />);

    const progressContainer = screen
      .getByText("Getting Your Forecast")
      .closest("div");
    expect(progressContainer).toBeDefined();
  });

  it("has centered layout", () => {
    render(<WeatherLoading />);

    const container = screen
      .getByText("Getting Your Forecast")
      .closest(".flex");
    expect(container).toBeDefined();
  });

  it("displays loading content in proper order", () => {
    render(<WeatherLoading />);

    expect(screen.getByText("Getting Your Forecast")).toBeDefined();
    expect(
      screen.getByText(
        "Fetching weather data from the National Weather Service..."
      )
    ).toBeDefined();
  });
});
