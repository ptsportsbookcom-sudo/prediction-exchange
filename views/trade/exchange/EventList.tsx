"use client";

interface EventListProps {
  events: string[];
  selectedEvent: string | null;
  onSelect: (eventName: string) => void;
}

export default function EventList({
  events,
  selectedEvent,
  onSelect,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-xs text-gray-500 px-2 py-4">No events available</div>
    );
  }

  return (
    <div className="space-y-0.5">
      {events.map((event) => (
        <button
          key={event}
          onClick={() => onSelect(event)}
          className={`w-full text-left px-2 py-1.5 text-xs font-medium transition-colors ${
            selectedEvent === event
              ? "bg-blue-100 text-blue-900"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {event}
        </button>
      ))}
    </div>
  );
}
