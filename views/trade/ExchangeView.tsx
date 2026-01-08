"use client";

import { useState, useMemo, useEffect } from "react";
import { useSimulator, Market } from "@/context/SimulatorContext";
import EventList from "./exchange/EventList";
import MarketTable from "./exchange/MarketTable";
import BetSlip from "./exchange/BetSlip";
import PositionsTable from "./exchange/PositionsTable";

export interface BetSlipSelection {
  market: Market;
  side: "BACK" | "LAY";
  odds: number;
}

export default function ExchangeView() {
  const { markets } = useSimulator();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [betSlipSelection, setBetSlipSelection] =
    useState<BetSlipSelection | null>(null);
  const [showPositions, setShowPositions] = useState(false);

  // Update bet slip selection when market odds change
  useEffect(() => {
    if (betSlipSelection) {
      const currentMarket = markets.find(
        (m) => m.id === betSlipSelection.market.id
      );
      if (
        currentMarket &&
        currentMarket.odds !== betSlipSelection.market.odds
      ) {
        const layOdds =
          betSlipSelection.side === "LAY"
            ? currentMarket.odds + 0.05
            : currentMarket.odds;
        setBetSlipSelection({
          ...betSlipSelection,
          market: currentMarket,
          odds: betSlipSelection.side === "BACK" ? currentMarket.odds : layOdds,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets]);

  // Group markets by event
  const eventsMap = useMemo(() => {
    const map = new Map<string, Market[]>();
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

  const handleEventSelect = (eventName: string) => {
    setSelectedEvent(eventName);
    setBetSlipSelection(null);
  };

  const handleMarketClick = (market: Market, side: "BACK" | "LAY") => {
    const layOdds = side === "LAY" ? market.odds + 0.05 : market.odds;
    setBetSlipSelection({
      market,
      side,
      odds: side === "BACK" ? market.odds : layOdds,
    });
  };

  const handleBetPlaced = () => {
    setBetSlipSelection(null);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left: Events List */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-2">
            Events
          </div>
          <EventList
            events={events}
            selectedEvent={selectedEvent}
            onSelect={handleEventSelect}
          />
        </div>
      </div>

      {/* Center: Market Table */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        {selectedEvent ? (
          <div className="p-3">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {selectedEvent}
            </div>
            <MarketTable
              markets={selectedMarkets}
              onMarketClick={handleMarketClick}
            />
            <div className="mt-4">
              <button
                onClick={() => setShowPositions(!showPositions)}
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1"
              >
                {showPositions ? "Hide" : "Show"} Open Bets
              </button>
              {showPositions && <PositionsTable />}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Select an event to view markets
          </div>
        )}
      </div>

      {/* Right: Bet Slip */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <BetSlip
          selection={betSlipSelection}
          onBetPlaced={handleBetPlaced}
        />
      </div>
    </div>
  );
}
