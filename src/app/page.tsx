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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {loading && <WeatherLoading />}

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              7-Day Weather Forecast
            </h1>

            <p className="text-gray-600 text-lg">
              Get detailed weather forecasts for any US address
            </p>
          </div>

          <AddressForm
            onSubmit={(inputAddress) => fetchForecast(inputAddress)}
            loading={loading}
          />
        </div>
      </header>

      <main>
        {error && (
          <div className="container mx-auto px-4 pt-12">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              <ErrorDisplay error={error} onDismiss={() => clearError()} />
              <WorkingExamples
                onExampleClick={(address) => fetchForecast(address)}
              />
            </div>
          </div>
        )}

        {data && (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
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

        {hasToShowEmptyState && (
          <div className="p-12 h-[50vh] flex items-center justify-center">
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  );
}
