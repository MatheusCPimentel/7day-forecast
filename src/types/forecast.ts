export interface GeocodingResult {
  result: {
    input: {
      address: {
        address: string;
      };
      benchmark: {
        isDefault: boolean;
        benchmarkDescription: string;
        id: string;
        benchmarkName: string;
      };
    };
    addressMatches: {
      tigerLine: {
        side: string;
        tigerLineId: string;
      };
      coordinates: {
        x: number; // longitude
        y: number; // latitude
      };
      addressComponents: {
        zip: string;
        streetName: string;
        preType: string;
        city: string;
        preDirection: string;
        suffixDirection: string;
        fromAddress: string;
        state: string;
        suffixType: string;
        toAddress: string;
        suffixQualifier: string;
        preQualifier: string;
      };
      matchedAddress: string;
    }[];
  };
}

export interface WeatherForecast {
  properties: {
    periods: WeatherPeriod[];
  };
}

export interface WeatherPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface GroupedWeatherDay {
  dayName: string;
  date: string;
  dayPeriod: WeatherPeriod | null;
  nightPeriod: WeatherPeriod | null;
}

export interface ForecastApiResponse {
  address: string;
  forecast: GroupedWeatherDay[];
  error?: string;
}

export enum ForecastError {
  ADDRESS_NOT_FOUND = "ADDRESS_NOT_FOUND",
  LOCATION_NOT_SUPPORTED = "LOCATION_NOT_SUPPORTED",
  FORECAST_UNAVAILABLE = "FORECAST_UNAVAILABLE",
}

export interface ForecastErrorResponse {
  error: string;
  suggestions?: string[];
}

export interface NWSPointResponse {
  properties: {
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
    forecastOffice: string;
    gridId: string;
    gridX: number;
    gridY: number;
    fireWeatherZone: string;
    county: string;
    radarStation: string;
    cwa: string;
    timeZone: string;
  };
}
