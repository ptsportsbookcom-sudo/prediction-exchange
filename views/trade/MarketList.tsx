"use client";

import { useSimulator } from "@/context/SimulatorContext";
import { Market } from "@/context/SimulatorContext";

interface MarketListProps {
  onBackClick: (market: Market) => void;
}

export default function MarketList({ onBackClick }: MarketListProps) {
  const { markets } = useSimulator();
  const openMarkets = markets.filter((m) => m.status === "OPEN");

  if (openMarkets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No open markets available
      </div>
    );
  }

  return (
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
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {openMarkets.map((market) => (
            <tr key={market.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">{market.eventName}</td>
              <td className="px-4 py-3 text-gray-600">{market.selection}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">
                {market.odds.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onBackClick(market)}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Back
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
