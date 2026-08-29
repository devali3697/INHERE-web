import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "./analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inherestudiohoian.com"),
  title: "INHERE | Ao Dai, Makeup & Photoshoot in Hội An",
  description: "Premium Hội An photography, Vietnamese Ao Dai styling, makeup and curated cultural experiences for couples, solo travelers and families.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "INHERE Hội An",
    title: "INHERE | Áo Dài, Makeup & Photoshoot in Hội An",
    description: "Premium Hội An photography, Vietnamese Áo Dài styling, makeup and curated cultural experiences for couples, solo travelers and families.",
    images: [{ url: "/inhere-logo.jpg", alt: "INHERE Hội An" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "INHERE | Áo Dài, Makeup & Photoshoot in Hội An",
    description: "Premium Hội An photography, Vietnamese Áo Dài styling, makeup and curated cultural experiences.",
    images: ["/inhere-logo.jpg"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/inhere-logo.jpg",
    shortcut: "/inhere-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
