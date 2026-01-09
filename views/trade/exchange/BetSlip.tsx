"use client";

import { useState, useEffect } from "react";
import { useSimulator } from "@/context/SimulatorContext";
import { BetSlipSelection } from "../ExchangeView";

interface BetSlipProps {
  selection: BetSlipSelection | null;
  onBetPlaced: () => void;
}

export default function BetSlip({ selection, onBetPlaced }: BetSlipProps) {
  const { wallet, placeTrade, selections, markets } = useSimulator();
  const [stake, setStake] = useState<string>("");
  const [oddsMoved, setOddsMoved] = useState(false);
  const [originalOdds, setOriginalOdds] = useState<number | null>(null);

  const stakeNum = parseFloat(stake) || 0;
  const market = selection
    ? markets.find((m) => m.id === selection.marketId)
    : null;

  // Get current selection odds (may have moved)
  const currentSelection = selection
    ? selections.find((s) => s.id === selection.selection.id)
    : null;
  const currentOdds = currentSelection
    ? selection?.side === "BACK"
      ? currentSelection.backOdds
      : currentSelection.layOdds
    : selection?.odds || 0;

  const availableLiquidity =
    currentSelection && market?.status === "OPEN"
      ? currentSelection.liquidity
      : 0;

  const maxStake = Math.min(wallet.balance, availableLiquidity || 0);

  const insufficientLiquidity =
    stakeNum > 0 && availableLiquidity > 0 && stakeNum > availableLiquidity;

  const isValid =
    selection &&
    market?.status === "OPEN" &&
    stakeNum > 0 &&
    stakeNum <= wallet.balance &&
    stakeNum <= availableLiquidity;

  // Track odds changes
  useEffect(() => {
    if (selection) {
      setOriginalOdds(selection.odds);
      setOddsMoved(false);
    }
  }, [selection?.selection.id]);

  useEffect(() => {
    if (selection && originalOdds && currentOdds && currentOdds !== originalOdds) {
      setOddsMoved(true);
    }
  }, [currentOdds, originalOdds, selection]);

  const potentialProfit =
    selection && stakeNum > 0
      ? selection.side === "BACK"
        ? stakeNum * (currentOdds - 1)
        : stakeNum * (currentOdds - 1) // Simplified for MVP
      : 0;

  const handlePlaceBet = () => {
    if (isValid && selection) {
      // For MVP, we only support BACK bets in the simulator
      // LAY bets would require different logic, but we'll use placeTrade for now
      placeTrade(selection.selection.id, stakeNum);
      setStake("");
      setOddsMoved(false);
      setOriginalOdds(null);
      onBetPlaced();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-200 px-3 py-2 border-b border-gray-300">
        <div className="text-xs font-semibold text-gray-900">Bet Slip</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selection ? (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">Event</div>
              <div className="text-xs font-medium text-gray-900">
                {selection.eventName}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Market</div>
              <div className="text-xs font-medium text-gray-900">
                Match Odds
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Selection</div>
              <div className="text-xs font-medium text-gray-900">
                {selection.selection.name}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Side</div>
              <div
                className={`text-xs font-medium ${
                  selection.side === "BACK" ? "text-blue-600" : "text-pink-600"
                }`}
              >
                {selection.side}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Odds</div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-gray-900">
                  {currentOdds.toFixed(2)}
                </div>
                {oddsMoved && originalOdds && (
                  <div className="text-xs text-gray-500">
                    (was {originalOdds.toFixed(2)})
                  </div>
                )}
              </div>
              {oddsMoved && (
                <div className="text-xs text-blue-600 mt-0.5">
                  Odds moved after your bet
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stake
              </label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                max={maxStake || wallet.balance}
                disabled={market?.status !== "OPEN"}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <div className="text-xs text-gray-500 mt-0.5">
                Balance: £{wallet.balance.toFixed(2)}{" "}
                {availableLiquidity > 0 && (
                  <>
                    | Liquidity: £{availableLiquidity.toFixed(2)}
                  </>
                )}
              </div>
              {insufficientLiquidity && (
                <div className="text-xs text-red-600 mt-0.5">
                  Insufficient liquidity at this price
                </div>
              )}
            </div>

            {stakeNum > 0 && (
              <div className="bg-gray-100 p-2 rounded">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Potential Profit</span>
                  <span className="font-semibold text-gray-900">
                    £{potentialProfit.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on odds: {currentOdds.toFixed(2)}
                </div>
              </div>
            )}

            {market && market.status !== "OPEN" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-xs text-yellow-800">
                  Market is {market.status.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-8">
            Click Back or Lay odds to add a bet
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 bg-gray-100 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Balance</span>
          <span className="text-sm font-semibold text-gray-900">
            £{wallet.balance.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePlaceBet}
          disabled={!isValid}
          className={`w-full py-2 text-xs font-medium transition-colors ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}
