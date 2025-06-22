import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useForecast } from "../useForecast";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("useForecast", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useForecast());

    expect(result.current.data).toBeNull();
    expect(result.current.address).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful forecast fetch", async () => {
    const mockForecastData = {
      address: "1600 Pennsylvania Avenue, Washington, DC",
      forecast: [
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
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockForecastData,
    } as Response);

    const { result } = renderHook(() => useForecast());

    await act(async () => {
      await result.current.fetchForecast(
        "1600 Pennsylvania Avenue, Washington, DC"
      );
    });

    expect(result.current.data).toEqual(mockForecastData.forecast);
    expect(result.current.address).toBe(mockForecastData.address);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Address not found" }),
    } as Response);

    const { result } = renderHook(() => useForecast());

    await act(async () => {
      await result.current.fetchForecast("Invalid Address");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.address).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual({ error: "Address not found" });
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useForecast());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("should set loading state during fetch", async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useForecast());

    act(() => {
      result.current.fetchForecast("Test Address");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({
          address: "Test Address",
          forecast: [],
        }),
      } as Response);
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});
