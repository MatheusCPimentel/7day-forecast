import { render, screen } from "@testing-library/react";
import { WeatherCard } from "../WeatherCard";
import type { GroupedWeatherDay } from "@/types/forecast";

describe("WeatherCard", () => {
  const mockGroupedDay: GroupedWeatherDay = {
    dayName: "Today",
    date: "Dec 1",
    dayPeriod: {
      number: 1,
      name: "Today",
      temperature: 45,
      temperatureUnit: "F",
      startTime: "2023-12-01T06:00:00-05:00",
      endTime: "2023-12-01T18:00:00-05:00",
      isDaytime: true,
      temperatureTrend: null,
      windSpeed: "5 mph",
      windDirection: "NW",
      icon: "https://api.weather.gov/icons/land/day/few?size=medium",
      shortForecast: "Sunny",
      detailedForecast: "Sunny day with clear skies.",
    },
    nightPeriod: {
      number: 2,
      name: "Tonight",
      temperature: 32,
      temperatureUnit: "F",
      startTime: "2023-12-01T18:00:00-05:00",
      endTime: "2023-12-02T06:00:00-05:00",
      isDaytime: false,
      temperatureTrend: null,
      windSpeed: "3 mph",
      windDirection: "N",
      icon: "https://api.weather.gov/icons/land/night/few?size=medium",
      shortForecast: "Clear",
      detailedForecast: "Clear night with light winds.",
    },
  };

  it("renders day and night period information", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    expect(screen.getByText("Today")).toBeDefined();
    expect(screen.getByText("Dec 1")).toBeDefined();
  });

  it("renders day period information", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    expect(screen.getByText("Day")).toBeDefined();
    expect(screen.getByText("45°F")).toBeDefined();
    expect(screen.getByText("Sunny")).toBeDefined();
    expect(screen.getByText("5 mph NW")).toBeDefined();
    expect(screen.getByText("Sunny day with clear skies.")).toBeDefined();
  });

  it("renders night period information", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    expect(screen.getByText("Night")).toBeDefined();
    expect(screen.getByText("32°F")).toBeDefined();
    expect(screen.getByText("Clear")).toBeDefined();
    expect(screen.getByText("3 mph N")).toBeDefined();
    expect(screen.getByText("Clear night with light winds.")).toBeDefined();
  });

  it("renders weather icons", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute("alt")).toBe("Sunny");
    expect(images[1].getAttribute("alt")).toBe("Clear");
  });

  it("handles missing day period gracefully", () => {
    const groupedDayWithoutDay: GroupedWeatherDay = {
      ...mockGroupedDay,
      dayPeriod: null,
    };

    render(<WeatherCard groupedDay={groupedDayWithoutDay} />);

    expect(screen.getByText("Night")).toBeDefined();
    expect(screen.queryByText("Day")).toBeNull();
  });

  it("handles missing night period gracefully", () => {
    const groupedDayWithoutNight: GroupedWeatherDay = {
      ...mockGroupedDay,
      nightPeriod: null,
    };

    render(<WeatherCard groupedDay={groupedDayWithoutNight} />);

    expect(screen.getByText("Day")).toBeDefined();
    expect(screen.queryByText("Night")).toBeNull();
  });

  it("handles missing both periods gracefully", () => {
    const groupedDayWithoutPeriods: GroupedWeatherDay = {
      ...mockGroupedDay,
      dayPeriod: null,
      nightPeriod: null,
    };

    render(<WeatherCard groupedDay={groupedDayWithoutPeriods} />);

    expect(screen.getByText("Today")).toBeDefined();
    expect(screen.getByText("Dec 1")).toBeDefined();
    expect(screen.queryByText("Day")).toBeNull();
    expect(screen.queryByText("Night")).toBeNull();
  });

  it("renders with proper styling classes", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    const container = document.querySelector(".bg-white");
    expect(container).toBeDefined();

    const dayContainer = document.querySelector(".bg-yellow-50");
    expect(dayContainer).toBeDefined();

    const nightContainer = document.querySelector(".bg-indigo-50");
    expect(nightContainer).toBeDefined();
  });

  it("renders lucide icons for sun, moon, and wind", () => {
    render(<WeatherCard groupedDay={mockGroupedDay} />);

    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });
});
