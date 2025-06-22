import { NextRequest, NextResponse } from "next/server";
import type { ForecastApiResponse } from "@/types/forecast";
import { groupPeriodsByDay } from "./utils";
import {
  getGeocodedLocation,
  fetchWeatherForecast,
  createErrorResponse,
} from "./services";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const location = await getGeocodedLocation(address);
    const forecast = await fetchWeatherForecast(location);
    const groupedForecast = groupPeriodsByDay(forecast.properties.periods);

    const response: ForecastApiResponse = {
      address: location.address,
      forecast: groupedForecast,
    };

    return NextResponse.json(response);
  } catch (error) {
    return createErrorResponse(error);
  }
}
