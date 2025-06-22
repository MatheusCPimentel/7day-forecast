import { useState, useCallback } from "react";
import {
  ForecastApiResponse,
  GroupedWeatherDay,
  ForecastError,
} from "@/types/forecast";

interface UseForecastState {
  data: GroupedWeatherDay[] | null;
  address: string | null;
  loading: boolean;
  error: string | ForecastError | null;
}

interface UseForecastReturn extends UseForecastState {
  fetchForecast: (address: string) => Promise<void>;
  clearError: () => void;
}

export function useForecast(): UseForecastReturn {
  const [state, setState] = useState<UseForecastState>({
    data: null,
    address: null,
    loading: false,
    error: null,
  });

  const fetchForecast = useCallback(async (address: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    const url = `/api/forecast?address=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const result: ForecastApiResponse = await response.json();

      setState((prev) => ({
        ...prev,
        data: result.forecast,
        address: result.address,
        loading: false,
        error: null,
      }));
    } catch (error) {
      let errorResult: string | ForecastError;

      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          errorResult = parsedError;
        } catch {
          errorResult = error.message;
        }
      } else {
        errorResult = "An unexpected error occurred";
      }

      setState((prev) => ({
        ...prev,
        data: null,
        address: null,
        loading: false,
        error: errorResult,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchForecast,
    clearError,
  };
}
