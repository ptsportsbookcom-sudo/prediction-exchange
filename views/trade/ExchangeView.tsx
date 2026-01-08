"use client";

import { useState, useMemo } from "react";
import { useSimulator, Selection } from "@/context/SimulatorContext";
import ExchangeGrid from "./exchange/ExchangeGrid";
import BetSlip from "./exchange/BetSlip";

export interface BetSlipSelection {
  eventId: string;
  eventName: string;
  marketId: string;
  selection: Selection;
  side: "BACK" | "LAY";
  odds: number;
}

export default function ExchangeView() {
  const { events, markets, selections } = useSimulator();
  const [betSlipSelection, setBetSlipSelection] =
    useState<BetSlipSelection | null>(null);

  // Prepare grid data: events with their match odds markets and selections
  const gridData = useMemo(() => {
    return events.map((event) => {
      const eventMarkets = markets.filter(
        (m) => m.eventId === event.id && m.type === "MATCH_ODDS" && m.status === "OPEN"
      );
      const matchOddsMarket = eventMarkets[0]; // Assume one MATCH_ODDS market per event
      
      if (!matchOddsMarket) return null;

      const marketSelections = selections.filter(
        (s) => s.marketId === matchOddsMarket.id
      );

      const homeSelection = marketSelections.find((s) => s.name === "HOME");
      const drawSelection = marketSelections.find((s) => s.name === "DRAW");
      const awaySelection = marketSelections.find((s) => s.name === "AWAY");

      // Calculate total volume (sum of all liquidity)
      const totalVolume = marketSelections.reduce(
        (sum, s) => sum + s.liquidity,
        0
      );

      return {
        event,
        market: matchOddsMarket,
        homeSelection,
        drawSelection,
        awaySelection,
        totalVolume,
      };
    }).filter(Boolean);
  }, [events, markets, selections]);

  const handleSelectionClick = (
    eventId: string,
    eventName: string,
    marketId: string,
    selection: Selection,
    side: "BACK" | "LAY"
  ) => {
    const odds = side === "BACK" ? selection.backOdds : selection.layOdds;
    setBetSlipSelection({
      eventId,
      eventName,
      marketId,
      selection,
      side,
      odds,
    });
  };

  const handleBetPlaced = () => {
    setBetSlipSelection(null);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Center: Exchange Grid */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        <ExchangeGrid
          gridData={gridData}
          onSelectionClick={handleSelectionClick}
        />
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
