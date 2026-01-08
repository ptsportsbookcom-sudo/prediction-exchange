"use client";

import { useState, useMemo } from "react";
import { useSimulator, MarketResult } from "@/context/SimulatorContext";

export default function OperatorConsole() {
  const { markets, createMarket, closeMarket, settleMarket } = useSimulator();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [odds, setOdds] = useState<string>("");
  const [liquidity, setLiquidity] = useState<string>("1000");
  const [settlingMarketId, setSettlingMarketId] = useState<string | null>(null);
  const [settlementResult, setSettlementResult] = useState<MarketResult>(null);

  // Group markets by event
  const eventsMap = useMemo(() => {
    const map = new Map<string, typeof markets>();
    markets.forEach((market) => {
      const eventMarkets = map.get(market.eventName) || [];
      eventMarkets.push(market);
      map.set(market.eventName, eventMarkets);
    });
    return map;
  }, [markets]);

  const events = Array.from(eventsMap.keys());
  const selectedMarkets = selectedEvent
    ? eventsMap.get(selectedEvent) || []
    : [];

  const handleCreateMarket = () => {
    const oddsNum = parseFloat(odds);
    const liquidityNum = parseFloat(liquidity) || 1000;
    if (eventName.trim() && oddsNum > 1) {
      createMarket(eventName.trim(), oddsNum, liquidityNum);
      setEventName("");
      setOdds("");
      setLiquidity("1000");
      if (!selectedEvent) {
        setSelectedEvent(eventName.trim());
      }
    }
  };

  const handleSettle = (marketId: string) => {
    if (settlementResult) {
      settleMarket(marketId, settlementResult);
      setSettlingMarketId(null);
      setSettlementResult(null);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left: Events List */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-2 border-b border-gray-200 bg-gray-100">
          <div className="text-xs font-semibold text-gray-700 uppercase mb-2">
            Create Event
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event name"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="Odds"
              min="1"
              step="0.01"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              placeholder="Liquidity (default: 1000)"
              min="100"
              step="100"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateMarket}
              disabled={!eventName.trim() || !odds || parseFloat(odds) <= 1}
              className={`w-full px-2 py-1 text-xs font-medium ${
                eventName.trim() && odds && parseFloat(odds) > 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Create Market
            </button>
          </div>
        </div>
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-2">
            Events
          </div>
          <div className="space-y-0.5">
            {events.map((event) => (
              <button
                key={event}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left px-2 py-1.5 text-xs font-medium ${
                  selectedEvent === event
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {event}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Event Details & Markets */}
      <div className="flex-1 overflow-y-auto">
        {selectedEvent ? (
          <div className="p-3">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              {selectedEvent}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                      Selection
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Odds
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Probability
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Status
                    </th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMarkets.map((market) => (
                    <tr key={market.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-2 py-1.5 text-gray-900">
                        {market.selection}
                      </td>
                      <td className="px-2 py-1.5 text-right font-semibold text-gray-900">
                        {market.odds.toFixed(2)}
                      </td>
                      <td className="px-2 py-1.5 text-right text-xs text-gray-600">
                        {(market.impliedProbability * 100).toFixed(1)}%
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
                            market.status === "OPEN"
                              ? "bg-green-100 text-green-800"
                              : market.status === "CLOSED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {market.status}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <div className="flex gap-1 justify-end">
                          {market.status === "OPEN" && (
                            <button
                              onClick={() => closeMarket(market.id)}
                              className="px-2 py-0.5 bg-gray-600 text-white text-xs font-medium hover:bg-gray-700"
                            >
                              Close
                            </button>
                          )}
                          {market.status === "CLOSED" && (
                            <>
                              {settlingMarketId === market.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      setSettlementResult("WIN")
                                    }
                                    className={`px-2 py-0.5 text-xs font-medium ${
                                      settlementResult === "WIN"
                                        ? "bg-green-600 text-white"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    WIN
                                  </button>
                                  <button
                                    onClick={() =>
                                      setSettlementResult("LOSE")
                                    }
                                    className={`px-2 py-0.5 text-xs font-medium ${
                                      settlementResult === "LOSE"
                                        ? "bg-red-600 text-white"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    LOSE
                                  </button>
                                  {settlementResult && (
                                    <button
                                      onClick={() => handleSettle(market.id)}
                                      className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSettlingMarketId(null);
                                      setSettlementResult(null);
                                    }}
                                    className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSettlingMarketId(market.id)}
                                  className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                                >
                                  Settle
                                </button>
                              )}
                            </>
                          )}
                          {market.status === "SETTLED" && (
                            <span className="text-xs text-gray-600">
                              {market.result}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            Select or create an event to manage markets
          </div>
        )}
      </div>
    </div>
  );
}
