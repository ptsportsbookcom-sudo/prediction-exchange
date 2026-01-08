"use client";

import { useState, useMemo } from "react";
import { useSimulator } from "@/context/SimulatorContext";

export default function AdminSettlement() {
  const {
    events,
    markets,
    selections,
    settleMarket,
    settlementHistory,
  } = useSimulator();
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(
    null
  );
  const [winningSelectionId, setWinningSelectionId] = useState<string | null>(
    null
  );

  const closedMarkets = markets.filter((m) => m.status === "CLOSED");
  const settledMarkets = markets.filter((m) => m.status === "SETTLED");

  const handleSettle = () => {
    if (selectedMarketId && winningSelectionId) {
      const market = markets.find((m) => m.id === selectedMarketId);
      if (market && market.status === "CLOSED") {
        settleMarket(selectedMarketId, winningSelectionId);
        setSelectedMarketId(null);
        setWinningSelectionId(null);
      }
    }
  };

  // Group markets by event
  const marketsByEvent = useMemo(() => {
    const map = new Map<string, typeof markets>();
    markets.forEach((market) => {
      const eventMarkets = map.get(market.eventId) || [];
      eventMarkets.push(market);
      map.set(market.eventId, eventMarkets);
    });
    return map;
  }, [markets]);

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
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Event
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Market
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Status
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {closedMarkets.map((market) => {
                    const event = events.find((e) => e.id === market.eventId);
                    return (
                      <tr
                        key={market.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="px-2 py-1.5 text-gray-900">
                          {event?.name || "Unknown"}
                        </td>
                        <td className="px-2 py-1.5 text-gray-600">
                          {market.type}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                            {market.status}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <button
                            onClick={() => setSelectedMarketId(market.id)}
                            className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                          >
                            Settle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                    {(() => {
                      const market = markets.find(
                        (m) => m.id === selectedMarketId
                      );
                      const event = market
                        ? events.find((e) => e.id === market.eventId)
                        : null;
                      return event?.name || "Unknown";
                    })()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {selections
                    .filter((s) => s.marketId === selectedMarketId)
                    .map((selection) => (
                      <button
                        key={selection.id}
                        onClick={() => setWinningSelectionId(selection.id)}
                        className={`px-3 py-1.5 text-xs font-medium ${
                          winningSelectionId === selection.id
                            ? "bg-green-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {selection.name}
                      </button>
                    ))}
                </div>
                {winningSelectionId && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSettle}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                      Confirm Settlement
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMarketId(null);
                        setWinningSelectionId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
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
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Event
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Market
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Winner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settledMarkets.map((market) => {
                    const event = events.find((e) => e.id === market.eventId);
                    const settlement = settlementHistory.find(
                      (s) => s.marketId === market.id
                    );
                    const winningSelection = settlement
                      ? selections.find((s) => s.id === settlement.winningSelectionId)
                      : null;
                    return (
                      <tr
                        key={market.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="px-2 py-1.5 text-gray-900">
                          {event?.name || "Unknown"}
                        </td>
                        <td className="px-2 py-1.5 text-gray-600">
                          {market.type}
                        </td>
                        <td className="px-2 py-1.5">
                          <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                            {winningSelection?.name || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Settlement History
          </h3>
          {settlementHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No settlement history</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Event
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Winner
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Settled At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settlementHistory
                    .slice()
                    .reverse()
                    .map((settlement) => {
                      const market = markets.find(
                        (m) => m.id === settlement.marketId
                      );
                      const event = market
                        ? events.find((e) => e.id === market.eventId)
                        : null;
                      const winningSelection = selections.find(
                        (s) => s.id === settlement.winningSelectionId
                      );
                      return (
                        <tr
                          key={settlement.id}
                          className="hover:bg-gray-50 border-b border-gray-200"
                        >
                          <td className="px-2 py-1.5 text-gray-900">
                            {event?.name || "Unknown Market"}
                          </td>
                          <td className="px-2 py-1.5">
                            <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                              {winningSelection?.name || "Unknown"}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-right text-gray-600">
                            {new Date(settlement.settledAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
