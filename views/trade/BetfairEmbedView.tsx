"use client";

import EmbedContainer from "@/components/EmbedContainer";
import { useAdminSettings } from "@/context/AdminSettingsContext";

export default function BetfairEmbedView() {
  const { betfairEnabled } = useAdminSettings();

  return (
    <div className="h-full">
      <EmbedContainer
        url="https://www.betfair.com"
        title="Betfair"
        fallbackToNewTab={true}
        enabled={betfairEnabled}
      />
    </div>
  );
}
