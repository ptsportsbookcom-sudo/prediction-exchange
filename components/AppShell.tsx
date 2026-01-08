"use client";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useView } from "@/context/ViewContext";
import TradeView from "@/views/trade/TradeView";
import AdminMarketControl from "@/views/admin/AdminMarketControl";
import AdminSettlement from "@/views/admin/AdminSettlement";

// Placeholder view components
function Betfair() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Betfair</h2>
      <p className="text-gray-600">Betfair view placeholder</p>
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
        return <TradeView />;
      case "betfair":
        return <Betfair />;
      case "market-control":
        return <AdminMarketControl />;
      case "settlement":
        return <AdminSettlement />;
      case "iframe-control":
        return <IframeControl />;
      default:
        return <TradeView />;
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
