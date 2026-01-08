"use client";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useView } from "@/context/ViewContext";
import PredictionEmbedView from "@/views/trade/PredictionEmbedView";
import BetfairEmbedView from "@/views/trade/BetfairEmbedView";
import ExchangeView from "@/views/trade/ExchangeView";
import OperatorConsole from "@/views/admin/OperatorConsole";
import AdminSettlement from "@/views/admin/AdminSettlement";
import AdminIframeControl from "@/views/admin/AdminIframeControl";

export default function AppShell() {
  const { view } = useView();

  const renderView = () => {
    switch (view) {
      case "prediction-markets":
        return <ExchangeView />;
      case "betfair":
        return <BetfairEmbedView />;
      case "market-control":
        return <OperatorConsole />;
      case "settlement":
        return <AdminSettlement />;
      case "iframe-control":
        return <AdminIframeControl />;
      default:
        return <ExchangeView />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden bg-white">{renderView()}</main>
      </div>
    </div>
  );
}
