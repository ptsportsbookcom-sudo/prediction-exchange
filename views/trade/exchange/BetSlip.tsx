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
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-100 px-3 py-2.5 border-b-2 border-gray-300">
        <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">Bet Slip</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selection ? (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Event</div>
              <div className="text-[11px] font-medium text-gray-900">
                {selection.eventName}
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Market</div>
              <div className="text-[11px] font-medium text-gray-900">
                Match Odds
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Selection</div>
              <div className="text-[11px] font-medium text-gray-900">
                {selection.selection.name}
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Side</div>
              <div
                className={`text-[11px] font-semibold ${
                  selection.side === "BACK" ? "text-blue-700" : "text-pink-700"
                }`}
              >
                {selection.side}
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1.5">Odds</div>
              <div className="flex items-baseline gap-2">
                <div className="text-base font-bold text-gray-900 tabular-nums">
                  {currentOdds.toFixed(2)}
                </div>
                {oddsMoved && originalOdds && (
                  <div className="text-[10px] text-gray-400 tabular-nums">
                    (was {originalOdds.toFixed(2)})
                  </div>
                )}
              </div>
              {oddsMoved && (
                <div className="text-[10px] text-blue-600 mt-1">
                  Odds moved after your bet
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 pb-3">
              <label className="block text-[10px] text-gray-500 uppercase mb-1.5 font-medium">
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
                disabled={market?.status !== "OPEN" || availableLiquidity <= 0}
                className="w-full px-2.5 py-2 border border-gray-300 rounded text-sm text-gray-900 font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
              <div className="text-[10px] text-gray-500 mt-1.5 tabular-nums">
                Balance: £{wallet.balance.toFixed(2)}{" "}
                {availableLiquidity > 0 && (
                  <>
                    | Liquidity: £{availableLiquidity.toFixed(2)}
                  </>
                )}
              </div>
              {insufficientLiquidity && (
                <div className="text-[10px] text-red-600 mt-1 font-medium">
                  Insufficient liquidity at this price
                </div>
              )}
            </div>

            {stakeNum > 0 && (
              <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] text-gray-600 uppercase">Potential Profit</span>
                  <span className="text-base font-bold text-gray-900 tabular-nums">
                    £{potentialProfit.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1 tabular-nums">
                  Based on odds: {currentOdds.toFixed(2)}
                </div>
              </div>
            )}

            {market && market.status !== "OPEN" && (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-2">
                <p className="text-[10px] text-yellow-800 font-medium">
                  Market is {market.status.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-gray-400 text-center py-12">
            Click Back or Lay odds to add a bet
          </div>
        )}
      </div>

      <div className="border-t-2 border-gray-300 bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <span className="text-[10px] text-gray-600 uppercase">Balance</span>
          <span className="text-sm font-bold text-gray-900 tabular-nums">
            £{wallet.balance.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePlaceBet}
          disabled={!isValid}
          className={`w-full py-2.5 text-sm font-bold transition-colors ${
            isValid
              ? "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 cursor-pointer"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}
