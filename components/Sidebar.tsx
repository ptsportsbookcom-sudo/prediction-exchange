"use client";

import { useMode } from "@/context/ModeContext";
import { useView, TradeView, AdminView } from "@/context/ViewContext";

export default function Sidebar() {
  const { mode } = useMode();
  const { view, setView } = useView();

  const tradeItems: { id: TradeView; label: string }[] = [
    { id: "prediction-markets", label: "Exchange" },
    { id: "my-bets", label: "My Bets" },
    { id: "wallet", label: "Wallet" },
    { id: "betfair", label: "Betfair (External)" },
  ];

  const adminItems: { id: AdminView; label: string }[] = [
    { id: "market-control", label: "Market Control" },
    { id: "settlement", label: "Settlement" },
    { id: "iframe-control", label: "Iframe Control" },
  ];

  const items = mode === "TRADE" ? tradeItems : adminItems;

  return (
    <div className="w-64 border-r-2 border-gray-300 bg-white">
      <nav className="p-3">
        {mode === "TRADE" && (
          <div className="mb-3 pb-2 border-b-2 border-gray-300">
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Trade
            </div>
          </div>
        )}
        {mode === "ADMIN" && (
          <div className="mb-3 pb-2 border-b-2 border-gray-300">
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Admin
            </div>
          </div>
        )}
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`w-full text-left px-3 py-2 text-[11px] font-medium transition-colors ${
                  view === item.id
                    ? "bg-blue-100 text-blue-900 border-l-2 border-blue-700"
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
