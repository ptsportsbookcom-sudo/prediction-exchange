"use client";

import { useState } from "react";
import { useSimulator, MarketResult } from "@/context/SimulatorContext";

export default function AdminSettlement() {
  const { markets, settleMarket } = useSimulator();
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<MarketResult>(null);

  const closedMarkets = markets.filter((m) => m.status === "CLOSED");
  const settledMarkets = markets.filter((m) => m.status === "SETTLED");

  const handleSettle = () => {
    if (selectedMarketId && selectedResult) {
      settleMarket(selectedMarketId, selectedResult);
      setSelectedMarketId(null);
      setSelectedResult(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settlement</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Closed Markets (Ready for Settlement)
          </h3>
          {closedMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm">No closed markets</p>
          ) : (
            <div className="overflow-x-auto mb-6">
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
                        <button
                          onClick={() => setSelectedMarketId(market.id)}
                          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Settle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedMarketId && (
            <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Settle Market
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    {
                      markets.find((m) => m.id === selectedMarketId)
                        ?.eventName
                    }
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedResult("WIN")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedResult === "WIN"
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    WIN
                  </button>
                  <button
                    onClick={() => setSelectedResult("LOSE")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedResult === "LOSE"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    LOSE
                  </button>
                </div>
                {selectedResult && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSettle}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Confirm Settlement
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMarketId(null);
                        setSelectedResult(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Settled Markets
          </h3>
          {settledMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm">No settled markets</p>
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
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {settledMarkets.map((market) => (
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
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            market.result === "WIN"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {market.result}
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
