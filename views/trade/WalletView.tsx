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
    <div className="p-4 space-y-5 text-[11px]">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Wallet</h2>
      <div className="grid grid-cols-3 gap-3 max-w-xl">
        <div className="border border-gray-300 rounded px-3 py-2.5 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1.5 tracking-wide">
            Starting Balance
          </div>
          <div className="text-sm font-bold text-gray-900 tabular-nums">
            {formatCurrency(STARTING_BALANCE)}
          </div>
        </div>
        <div className="border border-gray-300 rounded px-3 py-2.5 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1.5 tracking-wide">
            Current Balance
          </div>
          <div className="text-sm font-bold text-gray-900 tabular-nums">
            {formatCurrency(currentBalance)}
          </div>
        </div>
        <div className="border border-gray-300 rounded px-3 py-2.5 bg-gray-50">
          <div className="text-[10px] text-gray-500 uppercase mb-1.5 tracking-wide">
            P / L vs Start
          </div>
          <div
            className={`text-sm font-bold tabular-nums ${
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

      <div className="max-w-xl mt-5">
        <h3 className="text-[11px] font-semibold text-gray-800 mb-2.5 uppercase tracking-wide">
          Settled Summary
        </h3>
        <table className="w-full text-[11px] border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-800">
                Metric
              </th>
              <th className="px-3 py-2 text-right font-semibold text-gray-800">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-700">
                Total Staked (Settled)
              </td>
              <td className="px-3 py-2 text-right font-semibold text-gray-900 tabular-nums">
                {formatCurrency(totalStaked)}
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-700">
                Total Returned (Settled)
              </td>
              <td className="px-3 py-2 text-right font-semibold text-gray-900 tabular-nums">
                {formatCurrency(totalReturned)}
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-700 font-medium">Net P / L (Settled)</td>
              <td
                className={`px-3 py-2 text-right font-bold tabular-nums ${
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

