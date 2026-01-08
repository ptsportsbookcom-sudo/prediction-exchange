"use client";

import { useState } from "react";
import { useSimulator } from "@/context/SimulatorContext";
import { Market } from "@/context/SimulatorContext";

interface TradeTicketProps {
  market: Market;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TradeTicket({
  market,
  onClose,
  onConfirm,
}: TradeTicketProps) {
  const { wallet, placeTrade } = useSimulator();
  const [stake, setStake] = useState<string>("");
  const stakeNum = parseFloat(stake) || 0;
  const potentialPayout = stakeNum * market.odds;
  const isMarketOpen = market.status === "OPEN";
  const isValid = isMarketOpen && stakeNum > 0 && stakeNum <= wallet.balance;

  const handleConfirm = () => {
    if (isValid) {
      placeTrade(market.id, stakeNum);
      onConfirm();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Place Trade</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Event</div>
            <div className="font-medium text-gray-900">{market.eventName}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Selection</div>
            <div className="font-medium text-gray-900">{market.selection}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Odds</div>
            <div className="font-medium text-gray-900">
              {market.odds.toFixed(2)}
            </div>
          </div>

          {!isMarketOpen && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                This market is {market.status.toLowerCase()}. Trading is no longer available.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stake
            </label>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              max={wallet.balance}
              disabled={!isMarketOpen}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="text-xs text-gray-500 mt-1">
              Available: £{wallet.balance.toFixed(2)}
            </div>
          </div>

          {stakeNum > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Potential Payout</span>
                <span className="font-semibold text-gray-900">
                  £{potentialPayout.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Profit</span>
                <span className="font-semibold text-gray-900">
                  £{(potentialPayout - stakeNum).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`w-full py-2.5 text-sm font-medium transition-colors ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Trade
          </button>
        </div>
      </div>
    </div>
  );
}
