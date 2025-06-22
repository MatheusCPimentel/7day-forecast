import { XCircle } from "lucide-react";
import type { ForecastErrorResponse } from "@/types/forecast";

interface ErrorDisplayProps {
  error: string | ForecastErrorResponse;
  onDismiss: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  const isErrorObject = typeof error === "object";

  const errorMessage = isErrorObject
    ? error.error || "An error occurred"
    : error;

  return (
    <div className="flex bg-red-50 border border-red-200 rounded-lg p-6 max-w-4xl mx-auto">
      <XCircle className="h-5 w-5 text-red-400" />

      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800">Address Error</h3>

        <div className="mt-2 text-sm text-red-700">
          <p className="mb-3">{errorMessage}</p>

          {isErrorObject && error.suggestions && (
            <div>
              <p className="font-medium mb-2">Try these suggestions:</p>

              <ul className="list-disc list-inside space-y-1 pl-2">
                {error.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="mt-4 text-sm cursor-pointer bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
