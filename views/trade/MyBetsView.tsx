"use client";

import { useMemo } from "react";
import { useSimulator } from "@/context/SimulatorContext";

export default function MyBetsView() {
  const { events, markets, selections, trades, settlementHistory } =
    useSimulator();

  const { openBets, settledBets } = useMemo(() => {
    const open = trades.filter((t) => t.status === "OPEN");
    const settled = trades.filter((t) => t.status === "SETTLED");

    const mapBet = (trade: (typeof trades)[number]) => {
      const selection = selections.find((s) => s.id === trade.selectionId);
      const market = markets.find((m) => m.id === trade.marketId);
      const event = market
        ? events.find((e) => e.id === market.eventId)
        : null;
      const settlement = settlementHistory.find(
        (s) => s.marketId === trade.marketId
      );
      const isWinner =
        settlement && trade.selectionId === settlement.winningSelectionId;

      const payout =
        trade.status === "SETTLED" && isWinner ? trade.potentialPayout : 0;

      return {
        id: trade.id,
        eventName: event?.name || "Unknown",
        marketType: market?.type || "MATCH_ODDS",
        selectionName: selection?.name || "-",
        side: trade.side,
        odds: trade.odds,
        stake: trade.stake,
        potentialPayout: trade.potentialPayout,
        status: trade.status,
        result:
          trade.status === "SETTLED"
            ? isWinner
              ? "WON"
              : "LOST"
            : "OPEN",
        payout,
        settledAt: settlement?.settledAt,
      };
    };

    return {
      openBets: open.map(mapBet),
      settledBets: settled.map(mapBet),
    };
  }, [events, markets, selections, trades, settlementHistory]);

  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;

  return (
    <div className="p-4 space-y-6 text-[11px]">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">My Bets</h2>

      {/* Open Bets */}
      <div>
        <h3 className="text-[11px] font-semibold text-gray-800 mb-2.5 uppercase tracking-wide">
          Open Bets
        </h3>
        {openBets.length === 0 ? (
          <div className="text-[11px] text-gray-400 text-center py-8">
            No open bets
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Event
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Market
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Selection
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Side
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Odds
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Stake
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Potential Profit
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {openBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {bet.eventName}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {bet.marketType}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {bet.selectionName}
                    </td>
                    <td className={`px-3 py-2 text-gray-600 font-medium ${
                      bet.side === "BACK" ? "text-blue-700" : "text-pink-700"
                    }`}>
                      {bet.side}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {bet.odds.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {formatCurrency(bet.stake)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {formatCurrency(bet.potentialPayout - bet.stake)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {bet.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settled Bets */}
      <div>
        <h3 className="text-[11px] font-semibold text-gray-800 mb-2.5 uppercase tracking-wide">
          Settled Bets
        </h3>
        {settledBets.length === 0 ? (
          <div className="text-[11px] text-gray-400 text-center py-8">
            No settled bets yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Event
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Selection
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    Side
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Odds
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Stake
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Result
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Payout
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    Settled At
                  </th>
                </tr>
              </thead>
              <tbody>
                {settledBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {bet.eventName}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {bet.selectionName}
                    </td>
                    <td className={`px-3 py-2 text-gray-600 font-medium ${
                      bet.side === "BACK" ? "text-blue-700" : "text-pink-700"
                    }`}>
                      {bet.side}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {bet.odds.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {formatCurrency(bet.stake)}
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-bold ${
                        bet.result === "WON"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {bet.result}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold tabular-nums">
                      {formatCurrency(bet.payout)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500 text-[10px]">
                      {bet.settledAt
                        ? new Date(bet.settledAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

