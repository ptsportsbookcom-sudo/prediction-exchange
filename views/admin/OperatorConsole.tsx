"use client";

import { useState, useMemo } from "react";
import { useSimulator } from "@/context/SimulatorContext";

export default function OperatorConsole() {
  const {
    events,
    markets,
    selections,
    createEvent,
    openMarket,
    closeMarket,
    settleMarket,
    updateSelection,
  } = useSimulator();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [sport, setSport] = useState("Football");
  const [homeOdds, setHomeOdds] = useState<string>("");
  const [drawOdds, setDrawOdds] = useState<string>("");
  const [awayOdds, setAwayOdds] = useState<string>("");
  const [liquidity, setLiquidity] = useState<string>("1000");
  const [settlingMarketId, setSettlingMarketId] = useState<string | null>(null);
  const [winningSelectionId, setWinningSelectionId] = useState<string | null>(
    null
  );
  const [editedSelectionId, setEditedSelectionId] = useState<string | null>(
    null
  );

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

  const selectedMarkets = selectedEventId
    ? marketsByEvent.get(selectedEventId) || []
    : [];

  const handleCreateEvent = () => {
    if (eventName.trim()) {
      const eventId = createEvent(eventName.trim(), sport);
      setEventName("");
      setSport("Football");
      if (!selectedEventId) {
        setSelectedEventId(eventId);
      }
    }
  };

  const handleOpenMarket = () => {
    const home = parseFloat(homeOdds);
    const draw = parseFloat(drawOdds);
    const away = parseFloat(awayOdds);
    const liquidityNum = parseFloat(liquidity) || 1000;

    if (
      selectedEventId &&
      home > 1 &&
      draw > 1 &&
      away > 1 &&
      homeOdds &&
      drawOdds &&
      awayOdds
    ) {
      openMarket(selectedEventId, home, draw, away, liquidityNum);
      setHomeOdds("");
      setDrawOdds("");
      setAwayOdds("");
      setLiquidity("1000");
    }
  };

  const handleSettle = (marketId: string) => {
    if (winningSelectionId) {
      settleMarket(marketId, winningSelectionId);
      setSettlingMarketId(null);
      setWinningSelectionId(null);
    }
  };

  const selectedEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId)
    : null;

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
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Football</option>
            </select>
            <button
              onClick={handleCreateEvent}
              disabled={!eventName.trim()}
              className={`w-full px-2 py-1 text-xs font-medium ${
                eventName.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Create Event
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
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`w-full text-left px-2 py-1.5 text-xs font-medium ${
                  selectedEventId === event.id
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {event.name}
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
              {selectedEvent.name} ({selectedEvent.sport})
            </div>

            {/* Open Market Form */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="text-xs font-semibold text-gray-700 uppercase mb-2">
                Open Market
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="number"
                  value={homeOdds}
                  onChange={(e) => setHomeOdds(e.target.value)}
                  placeholder="Home odds"
                  min="1"
                  step="0.01"
                  className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={drawOdds}
                  onChange={(e) => setDrawOdds(e.target.value)}
                  placeholder="Draw odds"
                  min="1"
                  step="0.01"
                  className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={awayOdds}
                  onChange={(e) => setAwayOdds(e.target.value)}
                  placeholder="Away odds"
                  min="1"
                  step="0.01"
                  className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={liquidity}
                  onChange={(e) => setLiquidity(e.target.value)}
                  placeholder="Liquidity"
                  min="100"
                  step="100"
                  className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleOpenMarket}
                disabled={
                  !selectedEventId ||
                  !homeOdds ||
                  !drawOdds ||
                  !awayOdds ||
                  parseFloat(homeOdds) <= 1 ||
                  parseFloat(drawOdds) <= 1 ||
                  parseFloat(awayOdds) <= 1
                }
                className={`px-3 py-1 text-xs font-medium ${
                  selectedEventId &&
                  homeOdds &&
                  drawOdds &&
                  awayOdds &&
                  parseFloat(homeOdds) > 1 &&
                  parseFloat(drawOdds) > 1 &&
                  parseFloat(awayOdds) > 1
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Open Market
              </button>
            </div>

            {/* Markets Table */}
            {selectedMarkets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                        Market
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
                    {selectedMarkets.map((market) => {
                      const marketSelections = selections.filter(
                        (s) => s.marketId === market.id
                      );
                      return (
                        <>
                          <tr
                            key={market.id}
                            className="hover:bg-gray-50 border-b border-gray-200"
                          >
                            <td className="px-2 py-1.5 text-gray-900">
                              {market.type}
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
                                        {marketSelections.map((sel) => (
                                          <button
                                            key={sel.id}
                                            onClick={() =>
                                              setWinningSelectionId(sel.id)
                                            }
                                            className={`px-2 py-0.5 text-xs font-medium ${
                                              winningSelectionId === sel.id
                                                ? "bg-green-600 text-white"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                          >
                                            {sel.name}
                                          </button>
                                        ))}
                                        {winningSelectionId && (
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
                                            setWinningSelectionId(null);
                                          }}
                                          className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          setSettlingMarketId(market.id)
                                        }
                                        className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                                      >
                                        Settle
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                          {/* Selection rows */}
                          {marketSelections.map((selection) => (
                            <tr
                              key={selection.id}
                              className={`border-b border-gray-200 ${
                                editedSelectionId === selection.id
                                  ? "bg-yellow-50"
                                  : "bg-gray-50"
                              }`}
                            >
                              <td className="px-4 py-1.5 text-gray-600">
                                {selection.name}
                              </td>
                              <td className="px-2 py-1.5 text-right text-xs text-gray-600">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-500">
                                      Back
                                    </span>
                                    <input
                                      type="number"
                                      value={selection.backOdds.toFixed(2)}
                                      min={1.02}
                                      step={0.01}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val)) {
                                          updateSelection(selection.id, {
                                            backOdds: val,
                                          });
                                          setEditedSelectionId(selection.id);
                                        }
                                      }}
                                      className="w-14 px-1 py-0.5 border border-gray-300 rounded text-[10px] text-right"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-500">
                                      Lay
                                    </span>
                                    <input
                                      type="number"
                                      value={selection.layOdds.toFixed(2)}
                                      min={1.02}
                                      step={0.01}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val)) {
                                          updateSelection(selection.id, {
                                            layOdds: val,
                                          });
                                          setEditedSelectionId(selection.id);
                                        }
                                      }}
                                      className="w-14 px-1 py-0.5 border border-gray-300 rounded text-[10px] text-right"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-500">
                                      Liq
                                    </span>
                                    <input
                                      type="number"
                                      value={selection.liquidity.toFixed(0)}
                                      min={0}
                                      step={10}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val)) {
                                          updateSelection(selection.id, {
                                            liquidity: val,
                                          });
                                          setEditedSelectionId(selection.id);
                                        }
                                      }}
                                      className="w-16 px-1 py-0.5 border border-gray-300 rounded text-[10px] text-right"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td></td>
                            </tr>
                          ))}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
