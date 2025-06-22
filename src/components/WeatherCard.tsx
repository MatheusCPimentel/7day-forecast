import Image from "next/image";
import { Sun, Moon, Wind } from "lucide-react";
import type { GroupedWeatherDay, WeatherPeriod } from "@/types/forecast";

interface WeatherCardProps {
  groupedDay: GroupedWeatherDay;
}

interface PeriodCardProps {
  period: WeatherPeriod;
  isDay: boolean;
}

function PeriodCard({ period, isDay }: PeriodCardProps) {
  const colorClasses = isDay
    ? {
        bg: "bg-yellow-50",
        border: "border-yellow-400",
        text: "text-yellow-800",
        tempText: "text-yellow-600",
        forecastText: "text-yellow-700",
        windText: "text-yellow-600",
        iconColor: "text-yellow-600",
      }
    : {
        bg: "bg-indigo-50",
        border: "border-indigo-400",
        text: "text-indigo-800",
        tempText: "text-indigo-600",
        forecastText: "text-indigo-700",
        windText: "text-indigo-600",
        iconColor: "text-indigo-600",
      };

  const Icon = isDay ? Sun : Moon;
  const periodName = isDay ? "Day" : "Night";

  return (
    <div
      className={`flex-1 p-3 ${colorClasses.bg} rounded-md border-l-4 ${colorClasses.border} flex flex-col`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Icon className={`w-4 h-4 ${colorClasses.iconColor} mr-1`} />

          <h4 className={`text-sm font-medium ${colorClasses.text}`}>
            {periodName}
          </h4>
        </div>

        <span className={`text-lg font-bold ${colorClasses.tempText}`}>
          {period.temperature}°{period.temperatureUnit}
        </span>
      </div>

      <div className="flex items-center mb-3">
        <Image
          src={period.icon}
          alt={period.shortForecast}
          width={40}
          height={40}
          className="mr-3 flex-shrink-0 rounded-lg"
        />

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${colorClasses.forecastText} font-medium leading-tight mb-1`}
          >
            {period.shortForecast}
          </p>

          <div className={`flex items-center text-xs ${colorClasses.windText}`}>
            <Wind className="w-3 h-3 mr-1" />
            {period.windSpeed} {period.windDirection}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start">
        <p className={`text-xs ${colorClasses.forecastText} leading-relaxed`}>
          {period.detailedForecast}
        </p>
      </div>
    </div>
  );
}

export function WeatherCard({ groupedDay }: WeatherCardProps) {
  const { dayName, date, dayPeriod, nightPeriod } = groupedDay;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="text-center p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">{dayName}</h3>
        <p className="text-sm text-gray-600">{date}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        {dayPeriod && <PeriodCard period={dayPeriod} isDay={true} />}
        {nightPeriod && <PeriodCard period={nightPeriod} isDay={false} />}
      </div>
    </div>
  );
}
