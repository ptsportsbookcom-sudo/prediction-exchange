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
      <div className="flex items-center justify-center h-full text-gray-400 text-[11px]">
        No open markets available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-gray-300">
          <tr>
            <th className="px-3 py-2.5 text-left font-semibold text-gray-800 border-r border-gray-200">
              Event
            </th>
            <th className="px-3 py-2.5 text-right font-semibold text-gray-800 border-r border-gray-200 w-20">
              Volume
            </th>
            <th className="px-3 py-2.5 text-center font-semibold text-gray-800 border-r border-gray-200 w-32 bg-gray-50">
              1
            </th>
            <th className="px-3 py-2.5 text-center font-semibold text-gray-800 border-r border-gray-200 w-32 bg-gray-100">
              X
            </th>
            <th className="px-3 py-2.5 text-center font-semibold text-gray-800 w-32 bg-gray-50">
              2
            </th>
          </tr>
        </thead>
        <tbody>
          {gridData.map((row, rowIndex) => {
            if (!row) return null;
            const { event, market, homeSelection, drawSelection, awaySelection, totalVolume } = row;

            return (
              <tr
                key={event.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-3 py-2.5 text-gray-900 font-medium border-r border-gray-200 bg-white">
                  {event.name}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 font-medium tabular-nums border-r border-gray-200 bg-white">
                  £{totalVolume.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 border-r border-gray-200 bg-gray-50">
                  {homeSelection ? (
                    <SelectionCell
                      selection={homeSelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-300 text-center text-[10px]">-</div>
                  )}
                </td>
                <td className="px-3 py-2.5 border-r border-gray-200 bg-gray-100">
                  {drawSelection ? (
                    <SelectionCell
                      selection={drawSelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-300 text-center text-[10px]">-</div>
                  )}
                </td>
                <td className="px-3 py-2.5 bg-gray-50">
                  {awaySelection ? (
                    <SelectionCell
                      selection={awaySelection}
                      eventId={event.id}
                      eventName={event.name}
                      marketId={market.id}
                      onSelectionClick={onSelectionClick}
                    />
                  ) : (
                    <div className="text-gray-300 text-center text-[10px]">-</div>
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
