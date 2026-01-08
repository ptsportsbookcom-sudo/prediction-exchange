"use client";

import { useSimulator } from "@/context/SimulatorContext";

export default function PositionsTable() {
  const { positions, markets, trades } = useSimulator();

  const positionsWithDetails = positions.map((position) => {
    const market = markets.find((m) => m.id === position.marketId);
    const marketTrades = trades.filter((t) => t.marketId === position.marketId);
    return {
      ...position,
      market,
      trades: marketTrades,
    };
  });

  if (positionsWithDetails.length === 0) {
    return (
      <div className="text-xs text-gray-500 py-2">No open positions</div>
    );
  }

  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
              Event
            </th>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
              Selection
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
              Stake
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
              Odds
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
              Potential Payout
            </th>
            <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {positionsWithDetails.map((position) => {
            const avgOdds =
              position.trades.length > 0
                ? position.trades.reduce((sum, t) => sum + t.odds, 0) /
                  position.trades.length
                : 0;

            return (
              <tr key={position.marketId} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-2 py-1.5 text-gray-900">
                  {position.market?.eventName || "Unknown"}
                </td>
                <td className="px-2 py-1.5 text-gray-600">
                  {position.market?.selection || "-"}
                </td>
                <td className="px-2 py-1.5 text-right font-semibold text-gray-900">
                  £{position.totalStake.toFixed(2)}
                </td>
                <td className="px-2 py-1.5 text-right font-semibold text-gray-900">
                  {avgOdds.toFixed(2)}
                </td>
                <td className="px-2 py-1.5 text-right font-semibold text-gray-900">
                  £{position.potentialPayout.toFixed(2)}
                </td>
                <td className="px-2 py-1.5 text-right">
                  <span
                    className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
                      position.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : position.status === "CLOSED"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {position.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
