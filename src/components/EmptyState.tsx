import { Cloud } from "lucide-react";

export function EmptyState() {
  return (
    <div className="max-w-md mx-auto text-center">
      <Cloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Ready to get your forecast
      </h3>

      <p className="text-gray-500 mb-4">
        Enter a specific US street address with house number above
      </p>

      <p className="text-sm text-gray-400">
        Examples: &ldquo;123 Main St, Chicago, IL&rdquo; or &ldquo;1600
        Pennsylvania Ave, Washington, DC&rdquo;
      </p>
    </div>
  );
}
