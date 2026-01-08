"use client";

import { useMode } from "@/context/ModeContext";
import { useView, TradeView, AdminView } from "@/context/ViewContext";

export default function Sidebar() {
  const { mode } = useMode();
  const { view, setView } = useView();

  const tradeItems: { id: TradeView; label: string }[] = [
    { id: "prediction-markets", label: "Prediction Markets" },
    { id: "betfair", label: "Betfair" },
  ];

  const adminItems: { id: AdminView; label: string }[] = [
    { id: "market-control", label: "Market Control" },
    { id: "settlement", label: "Settlement" },
    { id: "iframe-control", label: "Iframe Control" },
  ];

  const items = mode === "TRADE" ? tradeItems : adminItems;

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <nav className="p-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                  view === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
