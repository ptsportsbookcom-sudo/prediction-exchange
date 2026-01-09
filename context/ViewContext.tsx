"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "./ModeContext";

export type TradeView = "prediction-markets" | "my-bets" | "wallet" | "betfair";
export type AdminView = "market-control" | "settlement" | "iframe-control";
export type View = TradeView | AdminView;

interface ViewContextType {
  view: View;
  setView: (view: View) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const { mode } = useMode();
  const [view, setView] = useState<View>(
    mode === "TRADE" ? "prediction-markets" : "market-control"
  );

  // Update view when mode changes
  useEffect(() => {
    if (mode === "TRADE") {
      setView("prediction-markets");
    } else {
      setView("market-control");
    }
  }, [mode]);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
