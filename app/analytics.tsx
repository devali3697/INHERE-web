"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function Analytics() {
  useEffect(() => {
    if (!measurementId || document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;

    const external = document.createElement("script");
    external.async = true;
    external.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    external.dataset.gaId = measurementId;
    document.head.appendChild(external);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
  }, []);

  return null;
}
