"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type MarketStatus = "OPEN" | "CLOSED" | "SETTLED";
export type TradeSide = "BACK";
export type TradeStatus = "OPEN" | "SETTLED";
export type SelectionName = "HOME" | "DRAW" | "AWAY";

export interface Event {
  id: string;
  name: string;
  sport: string;
}

export interface Market {
  id: string;
  eventId: string;
  type: "MATCH_ODDS";
  status: MarketStatus;
}

export interface Selection {
  id: string;
  marketId: string;
  name: SelectionName;
  backOdds: number;
  layOdds: number;
  liquidity: number;
  impliedProbability: number;
}

export interface Trade {
  id: string;
  selectionId: string;
  marketId: string;
  side: TradeSide;
  stake: number;
  odds: number;
  potentialPayout: number;
  status: TradeStatus;
}

export interface Position {
  selectionId: string;
  marketId: string;
  totalStake: number;
  potentialPayout: number;
  status: MarketStatus;
}

export interface SettlementHistory {
  id: string;
  marketId: string;
  winningSelectionId: string;
  settledAt: Date;
}

interface SimulatorContextType {
  events: Event[];
  markets: Market[];
  selections: Selection[];
  trades: Trade[];
  positions: Position[];
  wallet: {
    balance: number;
  };
  settlementHistory: SettlementHistory[];
  createEvent: (name: string, sport: string) => string;
  openMarket: (
    eventId: string,
    homeOdds: number,
    drawOdds: number,
    awayOdds: number,
    liquidity?: number
  ) => void;
  closeMarket: (marketId: string) => void;
  placeTrade: (selectionId: string, stake: number) => void;
  settleMarket: (marketId: string, winningSelectionId: string) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(
  undefined
);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [wallet, setWallet] = useState({ balance: 1000 });
  const [settlementHistory, setSettlementHistory] = useState<
    SettlementHistory[]
  >([]);

  const createEvent = useCallback((name: string, sport: string): string => {
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent: Event = {
      id: eventId,
      name,
      sport,
    };
    setEvents((prev) => [...prev, newEvent]);
    return eventId;
  }, []);

  const openMarket = useCallback(
    (
      eventId: string,
      homeOdds: number,
      drawOdds: number,
      awayOdds: number,
      liquidity: number = 1000
    ) => {
      const marketId = `market-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newMarket: Market = {
        id: marketId,
        eventId,
        type: "MATCH_ODDS",
        status: "OPEN",
      };

      // Create three selections
      const selectionNames: SelectionName[] = ["HOME", "DRAW", "AWAY"];
      const oddsArray = [homeOdds, drawOdds, awayOdds];
      const newSelections: Selection[] = selectionNames.map((name, index) => {
        const backOdds = oddsArray[index];
        const layOdds = backOdds + 0.05; // Small spread
        const impliedProbability = 1 / backOdds;
        return {
          id: `selection-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          marketId,
          name,
          backOdds,
          layOdds,
          liquidity,
          impliedProbability,
        };
      });

      setMarkets((prev) => [...prev, newMarket]);
      setSelections((prev) => [...prev, ...newSelections]);
    },
    []
  );

  const closeMarket = useCallback((marketId: string) => {
    setMarkets((prev) =>
      prev.map((market) =>
        market.id === marketId ? { ...market, status: "CLOSED" } : market
      )
    );
  }, []);

  const placeTrade = useCallback(
    (selectionId: string, stake: number) => {
      setSelections((prevSelections) => {
        const selection = prevSelections.find((s) => s.id === selectionId);
        if (!selection) {
          return prevSelections;
        }

        const market = markets.find((m) => m.id === selection.marketId);
        if (!market || market.status !== "OPEN") {
          return prevSelections;
        }

        if (wallet.balance < stake || stake <= 0) {
          return prevSelections;
        }

        // Calculate odds at time of trade (before price movement)
        const oddsAtTrade = selection.backOdds;
        const potentialPayout = stake * oddsAtTrade;

        // Update selection probability and odds (price movement simulation)
        const delta = stake / selection.liquidity;
        const newProbability = Math.min(0.95, selection.impliedProbability + delta);
        const newBackOdds = 1 / newProbability;
        const newLayOdds = newBackOdds + 0.05;

        // Update selection with new odds
        const updatedSelections = prevSelections.map((s) =>
          s.id === selectionId
            ? {
                ...s,
                impliedProbability: newProbability,
                backOdds: newBackOdds,
                layOdds: newLayOdds,
              }
            : s
        );

        // Create trade with odds at time of placement
        const newTrade: Trade = {
          id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          selectionId,
          marketId: selection.marketId,
          side: "BACK",
          stake,
          odds: oddsAtTrade,
          potentialPayout,
          status: "OPEN",
        };

        setTrades((prev) => [...prev, newTrade]);
        setWallet((prev) => ({ balance: prev.balance - stake }));

        return updatedSelections;
      });
      return true;
    },
    [markets, wallet.balance]
  );

  const settleMarket = useCallback(
    (marketId: string, winningSelectionId: string) => {
      setMarkets((prevMarkets) => {
        const market = prevMarkets.find((m) => m.id === marketId);
        if (!market) {
          return prevMarkets;
        }

        // Only allow settling CLOSED markets
        if (market.status !== "CLOSED") {
          return prevMarkets;
        }

        // Update market
        const updatedMarkets = prevMarkets.map((m) =>
          m.id === marketId ? { ...m, status: "SETTLED" as MarketStatus } : m
        );

        // Settle trades and calculate payout
        setTrades((prevTrades) => {
          const marketTrades = prevTrades.filter((t) => t.marketId === marketId);
          let totalPayout = 0;

          marketTrades.forEach((trade) => {
            if (trade.selectionId === winningSelectionId) {
              totalPayout += trade.potentialPayout;
            }
          });

          if (totalPayout > 0) {
            setWallet((prevWallet) => ({
              balance: prevWallet.balance + totalPayout,
            }));
          }

          return prevTrades.map((t) =>
            t.marketId === marketId ? { ...t, status: "SETTLED" } : t
          );
        });

        // Add to settlement history
        setSettlementHistory((prev) => [
          ...prev,
          {
            id: `settlement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            marketId,
            winningSelectionId,
            settledAt: new Date(),
          },
        ]);

        return updatedMarkets;
      });
    },
    []
  );

  // Calculate positions from trades
  const positions: Position[] = selections
    .map((selection) => {
      const selectionTrades = trades.filter(
        (t) => t.selectionId === selection.id
      );
      const totalStake = selectionTrades.reduce((sum, t) => sum + t.stake, 0);
      const potentialPayout = selectionTrades.reduce(
        (sum, t) => sum + t.potentialPayout,
        0
      );
      const market = markets.find((m) => m.id === selection.marketId);
      return {
        selectionId: selection.id,
        marketId: selection.marketId,
        totalStake,
        potentialPayout,
        status: market?.status || "OPEN",
      };
    })
    .filter((p) => p.totalStake > 0);

  return (
    <SimulatorContext.Provider
      value={{
        events,
        markets,
        selections,
        trades,
        positions,
        wallet,
        settlementHistory,
        createEvent,
        openMarket,
        closeMarket,
        placeTrade,
        settleMarket,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
}
