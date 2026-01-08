"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type MarketStatus = "OPEN" | "CLOSED" | "SETTLED";
export type MarketResult = "WIN" | "LOSE" | null;
export type TradeSide = "BACK";
export type TradeStatus = "OPEN" | "SETTLED";

export interface Market {
  id: string;
  eventName: string;
  marketType: "MATCH_WINNER";
  selection: "HOME";
  odds: number;
  status: MarketStatus;
  result: MarketResult;
  liquidity: number;
  impliedProbability: number;
}

export interface Trade {
  id: string;
  marketId: string;
  side: TradeSide;
  stake: number;
  odds: number;
  potentialPayout: number;
  status: TradeStatus;
}

export interface Position {
  marketId: string;
  totalStake: number;
  potentialPayout: number;
  status: MarketStatus;
}

export interface SettlementHistory {
  id: string;
  marketId: string;
  result: MarketResult;
  settledAt: Date;
}

interface SimulatorContextType {
  markets: Market[];
  trades: Trade[];
  positions: Position[];
  wallet: {
    balance: number;
  };
  settlementHistory: SettlementHistory[];
  createMarket: (eventName: string, odds: number, liquidity?: number) => void;
  closeMarket: (marketId: string) => void;
  placeTrade: (marketId: string, stake: number) => void;
  settleMarket: (marketId: string, result: MarketResult) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(
  undefined
);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [wallet, setWallet] = useState({ balance: 1000 });
  const [settlementHistory, setSettlementHistory] = useState<
    SettlementHistory[]
  >([]);

  const createMarket = useCallback(
    (eventName: string, odds: number, liquidity: number = 1000) => {
      const impliedProbability = 1 / odds;
      const newMarket: Market = {
        id: `market-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        eventName,
        marketType: "MATCH_WINNER",
        selection: "HOME",
        odds,
        status: "OPEN",
        result: null,
        liquidity,
        impliedProbability,
      };
      setMarkets((prev) => [...prev, newMarket]);
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
    (marketId: string, stake: number) => {
      setMarkets((prevMarkets) => {
        const market = prevMarkets.find((m) => m.id === marketId);
        if (!market) {
          return prevMarkets;
        }

        if (market.status !== "OPEN") {
          return prevMarkets;
        }

        if (wallet.balance < stake || stake <= 0) {
          return prevMarkets;
        }

        // Calculate odds at time of trade (before price movement)
        const oddsAtTrade = market.odds;
        const potentialPayout = stake * oddsAtTrade;

        // Update market probability and odds (price movement simulation)
        // Only move price if market is OPEN (frozen when CLOSED or SETTLED)
        if (market.status === "OPEN") {
          const delta = stake / market.liquidity;
          const newProbability = Math.min(0.95, market.impliedProbability + delta);
          const newOdds = 1 / newProbability;

          // Update market with new odds and probability
          const updatedMarkets = prevMarkets.map((m) =>
            m.id === marketId
              ? {
                  ...m,
                  impliedProbability: newProbability,
                  odds: newOdds,
                }
              : m
          );

          // Create trade with odds at time of placement
          const newTrade: Trade = {
            id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            marketId,
            side: "BACK",
            stake,
            odds: oddsAtTrade,
            potentialPayout,
            status: "OPEN",
          };

          setTrades((prev) => [...prev, newTrade]);
          setWallet((prev) => ({ balance: prev.balance - stake }));

          return updatedMarkets;
        }

        return prevMarkets;
      });
      return true;
    },
    [wallet.balance]
  );

  const settleMarket = useCallback(
    (marketId: string, result: MarketResult) => {
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
          m.id === marketId
            ? { ...m, status: "SETTLED" as MarketStatus, result }
            : m
        );

        // Settle trades and calculate payout
        setTrades((prevTrades) => {
          const marketTrades = prevTrades.filter((t) => t.marketId === marketId);
          let totalPayout = 0;

          marketTrades.forEach((trade) => {
            if (result === "WIN") {
              totalPayout += trade.potentialPayout;
            }
          });

          if (result === "WIN") {
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
            result,
            settledAt: new Date(),
          },
        ]);

        return updatedMarkets;
      });
    },
    []
  );

  // Calculate positions from trades
  const positions: Position[] = markets.map((market) => {
    const marketTrades = trades.filter((t) => t.marketId === market.id);
    const totalStake = marketTrades.reduce((sum, t) => sum + t.stake, 0);
    const potentialPayout = marketTrades.reduce(
      (sum, t) => sum + t.potentialPayout,
      0
    );
    return {
      marketId: market.id,
      totalStake,
      potentialPayout,
      status: market.status,
    };
  }).filter((p) => p.totalStake > 0);

  return (
    <SimulatorContext.Provider
      value={{
        markets,
        trades,
        positions,
        wallet,
        settlementHistory,
        createMarket,
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
