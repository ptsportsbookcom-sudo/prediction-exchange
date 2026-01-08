"use client";

import { useState, useRef, useEffect } from "react";

interface EmbedContainerProps {
  url: string;
  title: string;
  fallbackToNewTab: boolean;
  enabled: boolean;
}

export default function EmbedContainer({
  url,
  title,
  fallbackToNewTab,
  enabled,
}: EmbedContainerProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enabled) {
      setIframeError(false);
      setIframeLoaded(false);
      
      // Set a timeout to detect if iframe fails to load
      timeoutRef.current = setTimeout(() => {
        if (!iframeLoaded) {
          setIframeError(true);
        }
      }, 3000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [enabled, iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleIframeError = () => {
    setIframeError(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleOpenNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!enabled) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">This iframe is currently disabled.</p>
          <p className="text-sm text-gray-500">
            An admin can enable it in the Iframe Control section.
          </p>
        </div>
      </div>
    );
  }

  if (iframeError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <p className="text-gray-900 font-medium mb-2">
            This provider cannot be embedded.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            The content is blocked by the provider's security settings.
          </p>
          {fallbackToNewTab && (
            <button
              onClick={handleOpenNewTab}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Open in new tab
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
