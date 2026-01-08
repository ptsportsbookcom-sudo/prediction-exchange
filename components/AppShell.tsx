"use client";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useView } from "@/context/ViewContext";

// Placeholder view components
function PredictionMarkets() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Prediction Markets
      </h2>
      <p className="text-gray-600">Prediction Markets view placeholder</p>
    </div>
  );
}

function Betfair() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Betfair</h2>
      <p className="text-gray-600">Betfair view placeholder</p>
    </div>
  );
}

function MarketControl() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Market Control
      </h2>
      <p className="text-gray-600">Market Control view placeholder</p>
    </div>
  );
}

function Settlement() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Settlement</h2>
      <p className="text-gray-600">Settlement view placeholder</p>
    </div>
  );
}

function IframeControl() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Iframe Control
      </h2>
      <p className="text-gray-600">Iframe Control view placeholder</p>
    </div>
  );
}

export default function AppShell() {
  const { view } = useView();

  const renderView = () => {
    switch (view) {
      case "prediction-markets":
        return <PredictionMarkets />;
      case "betfair":
        return <Betfair />;
      case "market-control":
        return <MarketControl />;
      case "settlement":
        return <Settlement />;
      case "iframe-control":
        return <IframeControl />;
      default:
        return <PredictionMarkets />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">{renderView()}</main>
      </div>
    </div>
  );
}
