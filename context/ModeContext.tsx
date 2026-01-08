"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Mode = "TRADE" | "ADMIN";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isAdmin: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  // Hardcode admin user for now
  const isAdmin = true; // user.role === "ADMIN"
  const [mode, setMode] = useState<Mode>(isAdmin ? "ADMIN" : "TRADE");

  return (
    <ModeContext.Provider value={{ mode, setMode, isAdmin }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
