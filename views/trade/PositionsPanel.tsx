"use client";

import { useSimulator } from "@/context/SimulatorContext";

export default function PositionsPanel() {
  const { positions, markets } = useSimulator();

  const positionsWithMarketInfo = positions.map((position) => {
    const market = markets.find((m) => m.id === position.marketId);
    return {
      ...position,
      market,
    };
  });

  if (positionsWithMarketInfo.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-white">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Positions
          </h3>
          <p className="text-gray-500 text-sm">No open positions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Positions
        </h3>
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
                  Stake
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Potential Payout
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {positionsWithMarketInfo.map((position) => (
                <tr key={position.marketId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">
                    {position.market?.eventName || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {position.market?.selection || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    £{position.totalStake.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    £{position.potentialPayout.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
