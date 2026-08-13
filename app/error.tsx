"use client";

import SiteError from "@/components/site-error";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <SiteError reset={reset} />;
}
