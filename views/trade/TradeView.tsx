"use client";

import { useState } from "react";
import { useSimulator } from "@/context/SimulatorContext";
import { Market } from "@/context/SimulatorContext";
import WalletSummary from "./WalletSummary";
import MarketList from "./MarketList";
import TradeTicket from "./TradeTicket";
import PositionsPanel from "./PositionsPanel";

export default function TradeView() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handleBackClick = (market: Market) => {
    setSelectedMarket(market);
  };

  const handleCloseTicket = () => {
    setSelectedMarket(null);
  };

  const handleConfirmTrade = () => {
    setSelectedMarket(null);
  };

  return (
    <div className="flex flex-col min-h-full">
      <WalletSummary />
      <div className="flex-1">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Prediction Markets
          </h2>
          <MarketList onBackClick={handleBackClick} />
        </div>
        {selectedMarket && (
          <TradeTicket
            market={selectedMarket}
            onClose={handleCloseTicket}
            onConfirm={handleConfirmTrade}
          />
        )}
        <PositionsPanel />
      </div>
    </div>
  );
}
