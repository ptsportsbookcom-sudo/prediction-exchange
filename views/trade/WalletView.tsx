"use client";

import { useMemo } from "react";
import { useSimulator } from "@/context/SimulatorContext";

const STARTING_BALANCE = 1000;

export default function WalletView() {
  const { wallet, trades } = useSimulator();

  const { totalStaked, totalReturned, totalPnL } = useMemo(() => {
    const settledTrades = trades.filter((t) => t.status === "SETTLED");
    const totalStaked = settledTrades.reduce((sum, t) => sum + t.stake, 0);
    const totalReturned = settledTrades.reduce(
      (sum, t) => sum + t.potentialPayout,
      0
    );
    const totalPnL = totalReturned - totalStaked;
    return { totalStaked, totalReturned, totalPnL };
  }, [trades]);

  const currentBalance = wallet.balance;
  const pnlFromStart = currentBalance - STARTING_BALANCE;

  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;

  return (
    <div className="p-4 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-gray-900 mb-2">Wallet</h2>
      <div className="grid grid-cols-3 gap-3 max-w-xl">
        <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1">
            Starting Balance
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(STARTING_BALANCE)}
          </div>
        </div>
        <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1">
            Current Balance
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(currentBalance)}
          </div>
        </div>
        <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1">
            P / L vs Start
          </div>
          <div
            className={`text-sm font-semibold ${
              pnlFromStart > 0
                ? "text-green-700"
                : pnlFromStart < 0
                ? "text-red-700"
                : "text-gray-900"
            }`}
          >
            {formatCurrency(pnlFromStart)}
          </div>
        </div>
      </div>

      <div className="max-w-xl mt-4">
        <h3 className="text-xs font-semibold text-gray-800 mb-2">
          Settled Summary
        </h3>
        <table className="w-full text-[11px] border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                Metric
              </th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-2 py-1.5 text-gray-600">
                Total Staked (Settled)
              </td>
              <td className="px-2 py-1.5 text-right font-medium text-gray-900">
                {formatCurrency(totalStaked)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-2 py-1.5 text-gray-600">
                Total Returned (Settled)
              </td>
              <td className="px-2 py-1.5 text-right font-medium text-gray-900">
                {formatCurrency(totalReturned)}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1.5 text-gray-600">Net P / L (Settled)</td>
              <td
                className={`px-2 py-1.5 text-right font-semibold ${
                  totalPnL > 0
                    ? "text-green-700"
                    : totalPnL < 0
                    ? "text-red-700"
                    : "text-gray-900"
                }`}
              >
                {formatCurrency(totalPnL)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

