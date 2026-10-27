"use client";

import { useEffect } from "react";

export function WhatsAppClickTracker() {
  useEffect(() => {
    function trackClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }
      const link = event.target.closest<HTMLAnchorElement>(
        'a[href*="wa.me/"], a[href^="https://api.whatsapp.com/"], a[href^="whatsapp://"]',
      );
      if (!link || link.dataset.analyticsOptOut === "true") {
        return;
      }
      void fetch("/api/analytics/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePath: window.location.pathname }),
        keepalive: true,
      }).catch(() => {
        // Analytics is best-effort; do not interrupt a visitor's link action.
      });
    }

    document.addEventListener("click", trackClick, true);
    return () => document.removeEventListener("click", trackClick, true);
  }, []);

  return null;
}
