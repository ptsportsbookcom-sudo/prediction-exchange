"use client";

import EmbedContainer from "@/components/EmbedContainer";
import { useAdminSettings } from "@/context/AdminSettingsContext";

export default function PredictionEmbedView() {
  const { predictionEnabled } = useAdminSettings();

  return (
    <div className="h-full">
      <EmbedContainer
        url="https://example.com"
        title="Prediction Markets"
        fallbackToNewTab={false}
        enabled={predictionEnabled}
      />
    </div>
  );
}
