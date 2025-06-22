import type { WeatherPeriod, GroupedWeatherDay } from "@/types/forecast";

export function groupPeriodsByDay(
  periods: WeatherPeriod[]
): GroupedWeatherDay[] {
  const dayGroups: Array<{
    date: string;
    dayPeriod: WeatherPeriod | null;
    nightPeriod: WeatherPeriod | null;
  }> = [];

  for (const period of periods) {
    const date = formatDate(period.startTime);

    let group = dayGroups.find((g) => g.date === date);

    if (!group) {
      group = {
        date,
        dayPeriod: null,
        nightPeriod: null,
      };

      dayGroups.push(group);
    }

    if (period.isDaytime) {
      group.dayPeriod = period;
    } else {
      group.nightPeriod = period;
    }
  }

  return dayGroups.slice(0, 7).map((group, index) => {
    const periodForName = group.dayPeriod || group.nightPeriod;
    const isFirstDay = index === 0;

    return {
      dayName: isFirstDay ? "Today" : periodForName!.name,
      date: group.date,
      dayPeriod: group.dayPeriod,
      nightPeriod: group.nightPeriod,
    };
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
