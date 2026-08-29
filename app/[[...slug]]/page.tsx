import type { Metadata } from "next";
import InhereSite from "../site";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "INHERE | Áo Dài, Makeup & Photoshoot in Hội An",
    description: "Premium Hội An photography, Vietnamese Áo Dài styling, makeup and curated cultural experiences for couples, solo travelers and families.",
  },
  "/about": {
    title: "About INHERE | Hội An Photography Studio",
    description: "Meet INHERE, a local Hội An team creating outdoor Áo Dài, makeup and photography experiences in the Ancient Town.",
  },
  "/services": {
    title: "Hội An Photoshoot Packages & Pricing | INHERE",
    description: "Explore INHERE Full Combo packages for solo travelers, couples, families and friend groups, including outfit, makeup and photography.",
  },
  "/services/outfit-rental": {
    title: "Áo Dài & Vietnamese Outfit Rental in Hội An | INHERE",
    description: "Reserve Áo Dài and Vietnamese historical outfits in Hội An with matching accessories from INHERE.",
  },
  "/portfolio": {
    title: "Hội An Photography Lookbook | INHERE",
    description: "Explore outdoor Áo Dài, couple, family and lantern-night photography stories captured across Hội An Ancient Town.",
  },
  "/journal": {
    title: "Hội An Travel & Photography Journal | INHERE",
    description: "Local Hội An guides, photography locations, Áo Dài advice and travel inspiration from the INHERE team.",
  },
  "/faq": {
    title: "FAQ, Packages & Photoshoot Policies | INHERE Hội An",
    description: "Find answers about booking, weather, outfits, makeup, photo delivery, editing and INHERE Full Combo package prices.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`;
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const meta = pageMeta[normalizedPath] || pageMeta["/"];
  const isAdmin = normalizedPath.startsWith("/admin");

  return {
    ...meta,
    alternates: { canonical: isAdmin ? undefined : normalizedPath },
    robots: isAdmin ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: normalizedPath,
      siteName: "INHERE Hội An",
      title: meta.title,
      description: meta.description,
      images: [{ url: "/inhere-logo.jpg", alt: "INHERE Hội An" }],
    },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <InhereSite initialPath={`/${slug.join("/")}`} />;
}
