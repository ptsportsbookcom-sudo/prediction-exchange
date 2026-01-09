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

  const disabled = selection.liquidity <= 0;

  // Find best prices across all selections (simplified - in real exchange would compare across market)
  // For MVP, we'll just emphasize if odds are competitive
  const isBestBack = true; // Simplified - would need market context
  const isBestLay = true; // Simplified - would need market context

  return (
    <div className="flex flex-col gap-[1px]">
      {/* Back Row (Blue) */}
      <button
        onClick={() =>
          onSelectionClick(eventId, eventName, marketId, selection, "BACK")
        }
        disabled={disabled}
        className={`w-full px-2 py-1.5 text-[11px] flex items-center justify-between transition-colors ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            : "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
        }`}
      >
        <span className={`tabular-nums ${isBestBack && !disabled ? "font-bold" : "font-semibold"}`}>
          {selection.backOdds.toFixed(2)}
        </span>
        <span className="text-[10px] opacity-75 tabular-nums">
          {formatLiquidity(selection.liquidity)}
        </span>
      </button>
      {/* Lay Row (Pink) */}
      <button
        onClick={() =>
          onSelectionClick(eventId, eventName, marketId, selection, "LAY")
        }
        disabled={disabled}
        className={`w-full px-2 py-1.5 text-[11px] flex items-center justify-between transition-colors ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            : "bg-pink-700 text-white hover:bg-pink-800 cursor-pointer"
        }`}
      >
        <span className={`tabular-nums ${isBestLay && !disabled ? "font-bold" : "font-semibold"}`}>
          {selection.layOdds.toFixed(2)}
        </span>
        <span className="text-[10px] opacity-75 tabular-nums">
          {formatLiquidity(selection.liquidity)}
        </span>
      </button>
    </div>
  );
}
