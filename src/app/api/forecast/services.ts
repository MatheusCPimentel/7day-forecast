import { NextResponse } from "next/server";

import type {
  GeocodingResult,
  WeatherForecast,
  NWSPointResponse,
} from "@/types/forecast";
import { ForecastError } from "@/types/forecast";

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export async function getGeocodedLocation(
  address: string
): Promise<GeocodedLocation> {
  const geocodeUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(
    address
  )}&benchmark=2020&format=json`;

  const geocodeResponse = await fetch(geocodeUrl);

  if (!geocodeResponse.ok) {
    throw new Error("Failed to geocode address");
  }

  const geocodeData: GeocodingResult = await geocodeResponse.json();

  if (
    !geocodeData.result.addressMatches ||
    geocodeData.result.addressMatches.length === 0
  ) {
    throw new Error(ForecastError.ADDRESS_NOT_FOUND);
  }

  const { coordinates, matchedAddress } = geocodeData.result.addressMatches[0];
  const { x: longitude, y: latitude } = coordinates;

  return {
    latitude,
    longitude,
    address: matchedAddress,
  };
}

export async function fetchWeatherForecast(
  location: GeocodedLocation
): Promise<WeatherForecast> {
  const pointUrl = `https://api.weather.gov/points/${location.latitude},${location.longitude}`;
  const pointResponse = await fetch(pointUrl);

  if (!pointResponse.ok) {
    const pointError = await pointResponse.text();
    console.error("NWS Points API error:", pointError);
    throw new Error(ForecastError.LOCATION_NOT_SUPPORTED);
  }

  const pointData: NWSPointResponse = await pointResponse.json();
  const forecastUrl: string = pointData.properties.forecast;

  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    const forecastError = await forecastResponse.text();
    console.error("NWS Forecast API error:", forecastError);
    throw new Error(ForecastError.FORECAST_UNAVAILABLE);
  }

  return await forecastResponse.json();
}

export function createErrorResponse(error: unknown): NextResponse {
  console.error("Forecast API error:", error);

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  if (errorMessage === ForecastError.ADDRESS_NOT_FOUND) {
    return NextResponse.json(
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
  }

  if (errorMessage === ForecastError.LOCATION_NOT_SUPPORTED) {
    return NextResponse.json(
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
  }

  if (errorMessage === ForecastError.FORECAST_UNAVAILABLE) {
    return NextResponse.json(
      {
        error: "Weather forecast is temporarily unavailable for this location",
        suggestions: [
          "Try again in a few minutes",
          "Weather service may be temporarily down",
        ],
      },
      { status: 503 }
    );
  }

  if (errorMessage.includes("geocode")) {
    return NextResponse.json(
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
  }

  return NextResponse.json(
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
}
