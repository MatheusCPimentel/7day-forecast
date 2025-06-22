import { Lightbulb, MapPin } from "lucide-react";

interface WorkingExamplesProps {
  onExampleClick: (address: string) => void;
}

const EXAMPLE_ADDRESSES = [
  "1600 Pennsylvania Avenue, Washington, DC",
  "350 Fifth Avenue, New York, NY 10118",
  "100 Universal City Plaza, Universal City, CA",
  "1000 Fifth Avenue, New York, NY",
];

export function WorkingExamples({ onExampleClick }: WorkingExamplesProps) {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Lightbulb className="w-4 h-4 text-blue-600 mr-1" />

          <h4 className="text-sm font-medium text-blue-800">
            Try these working examples:
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          {EXAMPLE_ADDRESSES.map((address) => (
            <button
              key={address}
              onClick={() => onExampleClick(address)}
              className="flex w-fit gap-2 hover:text-blue-900 hover:underline p-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
