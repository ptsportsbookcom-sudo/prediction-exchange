"use client";

import { Selection } from "@/context/SimulatorContext";

interface SelectionCellProps {
  selection: Selection;
  eventId: string;
  eventName: string;
  marketId: string;
  onSelectionClick: (
    eventId: string,
    eventName: string,
    marketId: string,
    selection: Selection,
    side: "BACK" | "LAY"
  ) => void;
}

export default function SelectionCell({
  selection,
  eventId,
  eventName,
  marketId,
  onSelectionClick,
}: SelectionCellProps) {
  const formatLiquidity = (liquidity: number) => {
    if (liquidity >= 1000) {
      return `£${(liquidity / 1000).toFixed(1)}k`;
    }
    return `£${Math.round(liquidity)}`;
  };

  return (
    <div className="flex flex-col gap-px">
      {/* Back Row (Blue) */}
      <button
        onClick={() => onSelectionClick(eventId, eventName, marketId, selection, "BACK")}
        className="w-full px-2 py-1 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center justify-between"
      >
        <span>{selection.backOdds.toFixed(2)}</span>
        <span className="text-xs opacity-90">{formatLiquidity(selection.liquidity)}</span>
      </button>
      {/* Lay Row (Pink) */}
      <button
        onClick={() => onSelectionClick(eventId, eventName, marketId, selection, "LAY")}
        className="w-full px-2 py-1 bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 flex items-center justify-between"
      >
        <span>{selection.layOdds.toFixed(2)}</span>
        <span className="text-xs opacity-90">{formatLiquidity(selection.liquidity)}</span>
      </button>
    </div>
  );
}
