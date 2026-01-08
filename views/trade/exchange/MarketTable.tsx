"use client";

import { Market, Selection } from "@/context/SimulatorContext";

interface MarketTableProps {
  markets: Market[];
  selections: Selection[];
  onSelectionClick: (selection: Selection, side: "BACK" | "LAY") => void;
}

export default function MarketTable({
  markets,
  selections,
  onSelectionClick,
}: MarketTableProps) {
  const openMarkets = markets.filter((m) => m.status === "OPEN");

  if (openMarkets.length === 0) {
    return (
      <div className="text-xs text-gray-500 py-4">No open markets</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
              Selection
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 w-20 border-b border-gray-300">
              Back
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 w-20 border-b border-gray-300">
              Lay
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 w-16 border-b border-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {openMarkets.map((market) => {
            const marketSelections = selections.filter(
              (s) => s.marketId === market.id
            );
            return (
              <>
                <tr key={market.id} className="bg-blue-50 border-b border-gray-200">
                  <td colSpan={4} className="px-2 py-1 text-xs font-semibold text-gray-700">
                    {market.type}
                  </td>
                </tr>
                {marketSelections.map((selection) => (
                  <tr
                    key={selection.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-2 py-1.5 text-gray-900">
                      {selection.name}
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <button
                        onClick={() => onSelectionClick(selection, "BACK")}
                        className="w-full px-2 py-1 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                      >
                        {selection.backOdds.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <button
                        onClick={() => onSelectionClick(selection, "LAY")}
                        className="w-full px-2 py-1 bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700"
                      >
                        {selection.layOdds.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <span className="text-xs text-gray-600">{market.status}</span>
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
