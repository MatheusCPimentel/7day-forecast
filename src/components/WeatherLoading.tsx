import { Sun, Cloud } from "lucide-react";

export function WeatherLoading() {
  const DotsAnimationRender = ({ delay }: { delay: number }) => (
    <div
      className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:${delay}s]`}
    />
  );

  const RainDropsAnimationRender = ({ delay }: { delay: number }) => (
    <div
      className={`w-1 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:${delay}s]`}
    />
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="relative mb-6 flex justify-center items-center space-x-2">
          <Sun className="animate-spin-slow w-8 h-8 text-yellow-400" />

          <Cloud className="animate-float w-10 h-10 text-blue-300" />

          <div className="flex flex-col space-y-1">
            <RainDropsAnimationRender delay={0} />
            <RainDropsAnimationRender delay={0.2} />
            <RainDropsAnimationRender delay={0.4} />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Getting Your Forecast
        </h3>

        <p className="text-gray-600 mb-4">
          Fetching weather data from the National Weather Service...
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse" />

        <div className="flex justify-center space-x-1">
          <DotsAnimationRender delay={0} />
          <DotsAnimationRender delay={0.1} />
          <DotsAnimationRender delay={0.2} />
        </div>
      </div>
    </div>
  );
}
