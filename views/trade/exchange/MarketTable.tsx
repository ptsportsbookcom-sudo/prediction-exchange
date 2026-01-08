"use client";

import { Market } from "@/context/SimulatorContext";

interface MarketTableProps {
  markets: Market[];
  onMarketClick: (market: Market, side: "BACK" | "LAY") => void;
}

export default function MarketTable({
  markets,
  onMarketClick,
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
            // Lay odds = back odds + small spread
            const layOdds = market.odds + 0.05;
            return (
              <tr key={market.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-2 py-1.5 text-gray-900">{market.selection}</td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    onClick={() => onMarketClick(market, "BACK")}
                    className="w-full px-2 py-1 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    {market.odds.toFixed(2)}
                  </button>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    onClick={() => onMarketClick(market, "LAY")}
                    className="w-full px-2 py-1 bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700"
                  >
                    {layOdds.toFixed(2)}
                  </button>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <span className="text-xs text-gray-600">{market.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
