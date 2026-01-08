"use client";

import { useState } from "react";
import { useSimulator } from "@/context/SimulatorContext";

export default function AdminMarketControl() {
  const { markets, createMarket, closeMarket } = useSimulator();
  const [eventName, setEventName] = useState("");
  const [odds, setOdds] = useState<string>("");

  const handleCreateMarket = () => {
    const oddsNum = parseFloat(odds);
    if (eventName.trim() && oddsNum > 1) {
      createMarket(eventName.trim(), oddsNum);
      setEventName("");
      setOdds("");
    }
  };

  const openMarkets = markets.filter((m) => m.status === "OPEN");
  const closedMarkets = markets.filter((m) => m.status === "CLOSED");

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Market Control
      </h2>

      <div className="mb-8 bg-gray-50 p-6 rounded border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Market
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Manchester United vs Liverpool"
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odds
            </label>
            <input
              type="number"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="e.g., 1.80"
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreateMarket}
            disabled={!eventName.trim() || !odds || parseFloat(odds) <= 1}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              eventName.trim() && odds && parseFloat(odds) > 1
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Market
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Open Markets
          </h3>
          {openMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm">No open markets</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Selection
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Odds
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {openMarkets.map((market) => (
                    <tr key={market.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {market.eventName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {market.selection}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {market.odds.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => closeMarket(market.id)}
                          className="px-4 py-1.5 bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Closed Markets
          </h3>
          {closedMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm">No closed markets</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Selection
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Odds
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {closedMarkets.map((market) => (
                    <tr key={market.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {market.eventName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {market.selection}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {market.odds.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                          CLOSED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
