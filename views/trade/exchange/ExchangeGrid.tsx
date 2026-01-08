"use client";

import { Event, Market, Selection } from "@/context/SimulatorContext";
import SelectionCell from "./SelectionCell";

interface GridDataItem {
  event: Event;
  market: Market;
  homeSelection: Selection | undefined;
  drawSelection: Selection | undefined;
  awaySelection: Selection | undefined;
  totalVolume: number;
}

interface ExchangeGridProps {
  gridData: (GridDataItem | null)[];
  onSelectionClick: (
    eventId: string,
    eventName: string,
    marketId: string,
    selection: Selection,
    side: "BACK" | "LAY"
  ) => void;
}

export default function ExchangeGrid({
  gridData,
  onSelectionClick,
}: ExchangeGridProps) {
  if (gridData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-xs">
        No open markets available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-300">
              Event
            </th>
            <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b border-gray-300 w-20">
              Volume
            </th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-300 w-32">
              1
            </th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-300 w-32">
              X
            </th>
            <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-300 w-32">
              2
            </th>
          </tr>
        </thead>
        <tbody>
          {gridData.map((row) => {
            if (!row) return null;
            const { event, market, homeSelection, drawSelection, awaySelection, totalVolume } = row;

            return (
              <tr
                key={event.id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-3 py-2 text-gray-900 font-medium">
                  {event.name}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 font-medium">
                  £{totalVolume.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  {homeSelection ? (
                    <SelectionCell
                      selection={homeSelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-400 text-center">-</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  {drawSelection ? (
                    <SelectionCell
                      selection={drawSelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-400 text-center">-</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  {awaySelection ? (
                    <SelectionCell
                      selection={awaySelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-400 text-center">-</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
