"use client";

import SiteError from "@/components/site-error";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <SiteError reset={reset} />
      </body>
    </html>
  );
}
