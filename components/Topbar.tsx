"use client";

import { useMode } from "@/context/ModeContext";

export default function Topbar() {
  const { mode, setMode, isAdmin } = useMode();

  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="text-lg font-semibold text-gray-900">
        Prediction Exchange
      </div>
      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode("TRADE")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "TRADE"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            TRADE
          </button>
          <button
            onClick={() => setMode("ADMIN")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "ADMIN"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ADMIN
          </button>
        </div>
      )}
    </div>
  );
}
