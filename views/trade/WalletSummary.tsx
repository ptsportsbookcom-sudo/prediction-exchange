"use client";

import { useSimulator } from "@/context/SimulatorContext";

export default function WalletSummary() {
  const { wallet } = useSimulator();

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Balance</span>
        <span className="text-lg font-semibold text-gray-900">
          £{wallet.balance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
