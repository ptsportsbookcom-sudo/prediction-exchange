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
    <div className="p-4 space-y-6 text-xs">
      <h2 className="text-sm font-semibold text-gray-900">My Bets</h2>

      {/* Open Bets */}
      <div>
        <h3 className="text-xs font-semibold text-gray-800 mb-2">Open Bets</h3>
        {openBets.length === 0 ? (
          <div className="text-[11px] text-gray-500 py-2">No open bets</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Event
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Market
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Selection
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Side
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Odds
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Stake
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Potential Profit
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
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
                    <td className="px-2 py-1.5 text-gray-900">
                      {bet.eventName}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">
                      {bet.marketType}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">
                      {bet.selectionName}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">{bet.side}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {bet.odds.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {formatCurrency(bet.stake)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {formatCurrency(bet.potentialPayout - bet.stake)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-600">
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
        <h3 className="text-xs font-semibold text-gray-800 mb-2">
          Settled Bets
        </h3>
        {settledBets.length === 0 ? (
          <div className="text-[11px] text-gray-500 py-2">
            No settled bets yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Event
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Selection
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-300">
                    Side
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Odds
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Stake
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Result
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
                    Payout
                  </th>
                  <th className="px-2 py-1.5 text-right font-semibold text-gray-700 border-b border-gray-300">
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
                    <td className="px-2 py-1.5 text-gray-900">
                      {bet.eventName}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">
                      {bet.selectionName}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">{bet.side}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {bet.odds.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {formatCurrency(bet.stake)}
                    </td>
                    <td
                      className={`px-2 py-1.5 text-right font-semibold ${
                        bet.result === "WON"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {bet.result}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-900">
                      {formatCurrency(bet.payout)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-600">
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

