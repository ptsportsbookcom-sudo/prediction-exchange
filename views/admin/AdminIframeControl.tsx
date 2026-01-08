"use client";

import { useAdminSettings } from "@/context/AdminSettingsContext";

export default function AdminIframeControl() {
  const {
    predictionEnabled,
    betfairEnabled,
    setPredictionEnabled,
    setBetfairEnabled,
  } = useAdminSettings();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Iframe Control
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Prediction Markets
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Control iframe embedding for Prediction Markets view
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={predictionEnabled}
                onChange={(e) => setPredictionEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                predictionEnabled ? "text-green-600" : "text-gray-500"
              }`}
            >
              {predictionEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Betfair</h3>
              <p className="text-sm text-gray-600 mt-1">
                Control iframe embedding for Betfair view
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={betfairEnabled}
                onChange={(e) => setBetfairEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                betfairEnabled ? "text-green-600" : "text-gray-500"
              }`}
            >
              {betfairEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
