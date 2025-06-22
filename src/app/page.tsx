"use client";

import { useForecast } from "@/hooks/useForecast";
import { AddressForm } from "@/components/AddressForm";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherLoading } from "@/components/WeatherLoading";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { WorkingExamples } from "@/components/WorkingExamples";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { data, address, loading, error, fetchForecast, clearError } =
    useForecast();

  const hasToShowEmptyState = !data && !error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {loading && <WeatherLoading />}

      <div className="min-h-screen flex flex-col justify-center container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            7-Day Weather Forecast
          </h1>

          <p className="text-gray-600 text-lg">
            Get detailed weather forecasts for any US address
          </p>
        </header>

        <div className="mb-8">
          <AddressForm
            onSubmit={(inputAddress) => fetchForecast(inputAddress)}
            loading={loading}
          />
        </div>

        {error && (
          <div className="flex flex-col gap-8">
            <ErrorDisplay error={error} onDismiss={() => clearError()} />

            <WorkingExamples
              onExampleClick={(address) => fetchForecast(address)}
            />
          </div>
        )}

        {data && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                7-Day Weather Forecast for:
              </h2>

              <p className="text-lg text-gray-600">{address}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {data.map((groupedDay) => (
                <WeatherCard key={groupedDay.dayName} groupedDay={groupedDay} />
              ))}
            </div>
          </div>
        )}

        {hasToShowEmptyState && <EmptyState />}
      </div>
    </div>
  );
}
