import { NextResponse } from "next/server";
import {
  getGeocodedLocation,
  fetchWeatherForecast,
  createErrorResponse,
} from "../services";
import { ForecastError } from "@/types/forecast";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockNextResponse = NextResponse.json as jest.MockedFunction<
  typeof NextResponse.json
>;

describe("Forecast Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGeocodedLocation", () => {
    it("should return geocoded location for valid address", async () => {
      const mockResponse = {
        result: {
          addressMatches: [
            {
              coordinates: { x: -77.036, y: 38.895 },
              matchedAddress:
                "1600 Pennsylvania Avenue NW, Washington, DC 20500",
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getGeocodedLocation(
        "1600 Pennsylvania Avenue, Washington, DC"
      );

      expect(result).toEqual({
        latitude: 38.895,
        longitude: -77.036,
        address: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
      });
    });

    it("should throw ADDRESS_NOT_FOUND for invalid address", async () => {
      const mockResponse = {
        result: {
          addressMatches: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(getGeocodedLocation("Invalid Address")).rejects.toThrow(
        ForecastError.ADDRESS_NOT_FOUND
      );
    });

    it("should throw error when geocoding API fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(getGeocodedLocation("Some Address")).rejects.toThrow(
        "Failed to geocode address"
      );
    });

    it("should throw error when fetch throws", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getGeocodedLocation("Some Address")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("fetchWeatherForecast", () => {
    const mockLocation = {
      latitude: 38.895,
      longitude: -77.036,
      address: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
    };

    it("should return weather forecast for valid location", async () => {
      const mockPointResponse = {
        properties: {
          forecast: "https://api.weather.gov/gridpoints/LWX/97,71/forecast",
        },
      };

      const mockForecastResponse = {
        properties: {
          periods: [
            {
              number: 1,
              name: "Today",
              startTime: "2023-12-01T06:00:00-05:00",
              endTime: "2023-12-01T18:00:00-05:00",
              isDaytime: true,
              temperature: 45,
              temperatureUnit: "F",
              temperatureTrend: null,
              windSpeed: "5 mph",
              windDirection: "NW",
              icon: "https://api.weather.gov/icons/land/day/few?size=medium",
              shortForecast: "Sunny",
              detailedForecast: "Sunny day with clear skies.",
            },
          ],
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPointResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        } as Response);

      const result = await fetchWeatherForecast(mockLocation);

      expect(result).toEqual(mockForecastResponse);
    });

    it("should throw LOCATION_NOT_SUPPORTED when point API fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => "Point not found",
      } as Response);

      await expect(fetchWeatherForecast(mockLocation)).rejects.toThrow(
        ForecastError.LOCATION_NOT_SUPPORTED
      );
    });

    it("should throw FORECAST_UNAVAILABLE when forecast API fails", async () => {
      const mockPointResponse = {
        properties: {
          forecast: "https://api.weather.gov/gridpoints/LWX/97,71/forecast",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPointResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          text: async () => "Forecast not available",
        } as Response);

      await expect(fetchWeatherForecast(mockLocation)).rejects.toThrow(
        ForecastError.FORECAST_UNAVAILABLE
      );
    });

    it("should throw error when point fetch throws", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchWeatherForecast(mockLocation)).rejects.toThrow(
        "Network error"
      );
    });

    it("should throw error when forecast fetch throws", async () => {
      const mockPointResponse = {
        properties: {
          forecast: "https://api.weather.gov/gridpoints/LWX/97,71/forecast",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPointResponse,
        } as Response)
        .mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchWeatherForecast(mockLocation)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("createErrorResponse", () => {
    it("should create ADDRESS_NOT_FOUND error response", () => {
      const mockResponse = { json: "mock-response" };
      mockNextResponse.mockReturnValueOnce(
        mockResponse as unknown as NextResponse
      );

      const result = createErrorResponse(
        new Error(ForecastError.ADDRESS_NOT_FOUND)
      );

      expect(mockNextResponse).toHaveBeenCalledWith(
        {
          error:
            'Address not found. Please try a specific street address with a house number (e.g., "123 Main Street, Chicago, IL" or "1600 Pennsylvania Avenue, Washington, DC"). Landmarks, intersections, or area names may not work.',
          suggestions: [
            "Include a house or building number",
            'Use full street names (e.g., "Street" instead of "St")',
            "Try adding the ZIP code",
            "Avoid landmarks or area names - use specific addresses",
          ],
        },
        { status: 404 }
      );
      expect(result).toBe(mockResponse);
    });

    it("should create LOCATION_NOT_SUPPORTED error response", () => {
      const mockResponse = { json: "mock-response" };
      mockNextResponse.mockReturnValueOnce(
        mockResponse as unknown as NextResponse
      );

      const result = createErrorResponse(
        new Error(ForecastError.LOCATION_NOT_SUPPORTED)
      );

      expect(mockNextResponse).toHaveBeenCalledWith(
        {
          error:
            "This location may be outside the US or in an area not covered by the National Weather Service",
          suggestions: [
            "Ensure the address is within the United States",
            "Try a different address within the US",
          ],
        },
        { status: 422 }
      );
      expect(result).toBe(mockResponse);
    });

    it("should create FORECAST_UNAVAILABLE error response", () => {
      const mockResponse = { json: "mock-response" };
      mockNextResponse.mockReturnValueOnce(
        mockResponse as unknown as NextResponse
      );

      const result = createErrorResponse(
        new Error(ForecastError.FORECAST_UNAVAILABLE)
      );

      expect(mockNextResponse).toHaveBeenCalledWith(
        {
          error:
            "Weather forecast is temporarily unavailable for this location",
          suggestions: [
            "Try again in a few minutes",
            "Weather service may be temporarily down",
          ],
        },
        { status: 503 }
      );
      expect(result).toBe(mockResponse);
    });

    it("should handle geocode errors", () => {
      const mockResponse = { json: "mock-response" };
      mockNextResponse.mockReturnValueOnce(
        mockResponse as unknown as NextResponse
      );

      const result = createErrorResponse(
        new Error("Failed to geocode address")
      );

      expect(mockNextResponse).toHaveBeenCalledWith(
        {
          error:
            "Unable to find the address. Please check the spelling and try a complete street address with house number.",
          suggestions: [
            'Example: "123 Main Street, Chicago, IL 60601"',
            "Include house number, street name, city, and state",
            "Avoid abbreviations when possible",
          ],
        },
        { status: 500 }
      );
      expect(result).toBe(mockResponse);
    });

    it("should handle generic errors", () => {
      const mockResponse = { json: "mock-response" };
      mockNextResponse.mockReturnValueOnce(
        mockResponse as unknown as NextResponse
      );

      const result = createErrorResponse(new Error("Some other error"));

      expect(mockNextResponse).toHaveBeenCalledWith(
        {
          error: "Failed to get weather forecast. Please try again.",
          suggestions: [
            "Check your internet connection",
            "Try a different address",
            "Contact support if the problem persists",
          ],
        },
        { status: 500 }
      );
      expect(result).toBe(mockResponse);
    });
  });
});
