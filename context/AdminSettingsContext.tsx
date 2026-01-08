"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSettingsContextType {
  predictionEnabled: boolean;
  betfairEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  setBetfairEnabled: (enabled: boolean) => void;
}

const AdminSettingsContext = createContext<
  AdminSettingsContextType | undefined
>(undefined);

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [predictionEnabled, setPredictionEnabled] = useState(true);
  const [betfairEnabled, setBetfairEnabled] = useState(true);

  return (
    <AdminSettingsContext.Provider
      value={{
        predictionEnabled,
        betfairEnabled,
        setPredictionEnabled,
        setBetfairEnabled,
      }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useAdminSettings must be used within an AdminSettingsProvider"
    );
  }
  return context;
}
