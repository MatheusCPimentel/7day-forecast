import { formatDate, groupPeriodsByDay } from "../utils";
import type { WeatherPeriod } from "@/types/forecast";

describe("Forecast Utils", () => {
  describe("formatDate", () => {
    it("should format date correctly for December", () => {
      expect(formatDate("2023-12-01T12:00:00Z")).toBe("Dec 1");
    });

    it("should format date correctly for January", () => {
      expect(formatDate("2023-01-15T12:00:00Z")).toBe("Jan 15");
    });

    it("should format date correctly for June", () => {
      expect(formatDate("2023-06-30T12:00:00Z")).toBe("Jun 30");
    });

    it("should handle single digit days", () => {
      expect(formatDate("2023-03-05T12:00:00Z")).toBe("Mar 5");
    });

    it("should handle double digit days", () => {
      expect(formatDate("2023-11-25T12:00:00Z")).toBe("Nov 25");
    });
  });

  describe("groupPeriodsByDay", () => {
    const createMockPeriod = (
      name: string,
      isDaytime: boolean,
      startTime: string
    ): WeatherPeriod => ({
      number: 1,
      name,
      startTime,
      endTime: "2023-12-01T18:00:00-05:00",
      isDaytime,
      temperature: 45,
      temperatureUnit: "F",
      temperatureTrend: null,
      windSpeed: "5 mph",
      windDirection: "NW",
      icon: "https://api.weather.gov/icons/land/day/few?size=medium",
      shortForecast: "Sunny",
      detailedForecast: "Sunny day with clear skies.",
    });

    it("should group single day with both day and night periods", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Today", true, "2023-12-01T06:00:00-05:00"),
        createMockPeriod("Tonight", false, "2023-12-01T18:00:00-05:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        dayName: "Today",
        date: "Dec 1",
        dayPeriod: periods[0],
        nightPeriod: periods[1],
      });
    });

    it("should group multiple days correctly", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Today", true, "2023-12-01T06:00:00-05:00"),
        createMockPeriod("Tonight", false, "2023-12-01T18:00:00-05:00"),
        createMockPeriod("Saturday", true, "2023-12-02T06:00:00-05:00"),
        createMockPeriod("Saturday Night", false, "2023-12-02T18:00:00-05:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(2);
      expect(result[0].dayName).toBe("Today");
      expect(result[1].dayName).toBe("Saturday");
    });

    it("should handle day period without corresponding night period", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Today", true, "2023-12-01T06:00:00-05:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        dayName: "Today",
        date: "Dec 1",
        dayPeriod: periods[0],
        nightPeriod: null,
      });
    });

    it("should handle night period without corresponding day period", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Tonight", false, "2023-12-01T18:00:00-05:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        dayName: "Today",
        date: "Dec 1",
        dayPeriod: null,
        nightPeriod: periods[0],
      });
    });

    it("should handle periods in mixed order", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Saturday Night", false, "2023-12-02T18:00:00-05:00"),
        createMockPeriod("Today", true, "2023-12-01T06:00:00-05:00"),
        createMockPeriod("Saturday", true, "2023-12-02T06:00:00-05:00"),
        createMockPeriod("Tonight", false, "2023-12-01T18:00:00-05:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe("Dec 2");
      expect(result[0].dayName).toBe("Today"); // First group (index 0) is always "Today"
      expect(result[0].dayPeriod?.name).toBe("Saturday");
      expect(result[0].nightPeriod?.name).toBe("Saturday Night");

      expect(result[1].date).toBe("Dec 1");
      expect(result[1].dayName).toBe("Today"); // Second group uses the period name "Today"
      expect(result[1].dayPeriod?.name).toBe("Today");
      expect(result[1].nightPeriod?.name).toBe("Tonight");
    });

    it("should handle timezone differences correctly", () => {
      const periods: WeatherPeriod[] = [
        createMockPeriod("Today", true, "2023-12-01T06:00:00-08:00"),
        createMockPeriod("Tonight", false, "2023-12-01T18:00:00-08:00"),
      ];

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(1);
      expect(result[0].dayName).toBe("Today");
    });

    it("should handle 7+ day forecast correctly", () => {
      const periods: WeatherPeriod[] = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date("2023-12-01T06:00:00-05:00");
        date.setDate(date.getDate() + Math.floor(i / 2));
        const isDaytime = i % 2 === 0;
        const name = i === 0 ? "Today" : `Day ${Math.floor(i / 2) + 1}`;

        periods.push(createMockPeriod(name, isDaytime, date.toISOString()));
      }

      const result = groupPeriodsByDay(periods);

      expect(result).toHaveLength(7);
    });

    it("should handle empty periods array", () => {
      const result = groupPeriodsByDay([]);
      expect(result).toEqual([]);
    });

    it("should always set first day name to 'Today' regardless of period name", () => {
      const testCases = [
        "This Afternoon",
        "This Morning",
        "This Evening",
        "Tonight",
        "Today",
        "Some Other Name",
      ];

      testCases.forEach((firstPeriodName) => {
        const periods = [
          createMockPeriod(firstPeriodName, true, "2023-12-01T06:00:00-05:00"),
          createMockPeriod("Saturday", true, "2023-12-02T06:00:00-05:00"),
        ];

        const result = groupPeriodsByDay(periods);

        expect(result[0].dayName).toBe("Today");
        expect(result[1].dayName).toBe("Saturday");
      });
    });
  });
});
