import type { Metadata } from "next";
import InhereSite from "../site";

type ArticleMetadataRow = {
  title_en: string | null;
  excerpt_en: string | null;
  cover_image: string | null;
};

async function getPublishedArticleMetadata(slug: string): Promise<ArticleMetadataRow | null> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://phqyikcotdmachgvoqyb.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_9SyO3dsyKVWI2M32TKKj9Q_fdmYkEzS";
  const query = new URLSearchParams({
    slug: `eq.${slug}`,
    status: "eq.published",
    select: "title_en,excerpt_en,cover_image",
    limit: "1",
  });
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?${query}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as ArticleMetadataRow[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

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
  "/services/solo-photoshoot": {
    title: "Solo Áo Dài Photoshoot in Hội An | INHERE",
    description: "Explore INHERE's solo Full Combo: Áo Dài, makeup, hairstyling and an outdoor photoshoot in Hội An. From 1,800,000 VND, with 25 edited photos.",
  },
  "/services/couple-photoshoot": {
    title: "Couple Áo Dài Photoshoot in Hội An | INHERE",
    description: "Explore INHERE's couple Full Combo: two outfits, styling, makeup and an outdoor photoshoot across Hội An. From 2,700,000 VND, with 30 edited photos.",
  },
  "/services/family-photoshoot": {
    title: "Family Photoshoot & Áo Dài in Hội An | INHERE",
    description: "Plan a family Áo Dài experience in Hội An with outfits, accessories, makeup and a guided outdoor photoshoot. Packages start from 3,500,000 VND.",
  },
  "/services/group-photoshoot": {
    title: "Friend Group Photoshoot in Hội An | INHERE",
    description: "Book an outdoor friend group photoshoot in Hội An with Áo Dài outfits, accessories and makeup for female guests. Packages start from 2,900,000 VND.",
  },
  "/portfolio": {
    title: "Hội An Photography Lookbook | INHERE",
    description: "Explore outdoor Áo Dài, couple, family and lantern-night photography stories captured across Hội An Ancient Town.",
  },
  "/journal": {
    title: "Hội An Travel & Photography Journal | INHERE",
    description: "Local Hội An guides, photography locations, Áo Dài advice and travel inspiration from the INHERE team.",
  },
  "/experiences": {
    title: "Hội An Photography & Travel Journal | INHERE",
    description: "Read local guides to Hội An's outdoor photography locations, Áo Dài styling, rooftop views and Ancient Town experiences from INHERE.",
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
  const isArticle =
    slug.length === 2 && (slug[0] === "experiences" || slug[0] === "blog");
  const article = isArticle ? await getPublishedArticleMetadata(slug[1]) : null;
  const articleDescription = article?.excerpt_en?.replace(/\s+/g, " ").trim();
  const meta = article
    ? {
        title: `${article.title_en || "Hội An Travel Guide"} | INHERE`,
        description: articleDescription || pageMeta["/journal"].description,
      }
    : pageMeta[normalizedPath] || pageMeta["/"];
  const isAdmin = normalizedPath.startsWith("/admin");

  return {
    ...meta,
    alternates: { canonical: isAdmin ? undefined : normalizedPath },
    robots: isAdmin ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: article ? "article" : "website",
      url: normalizedPath,
      siteName: "INHERE Hội An",
      title: meta.title,
      description: meta.description,
      images: [{ url: article?.cover_image || "/inhere-logo.jpg", alt: article?.title_en || "INHERE Hội An" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [article?.cover_image || "/inhere-logo.jpg"],
    },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`;
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://inherestudiohoian.com/#studio",
    name: "INHERE Studio Hội An",
    url: "https://inherestudiohoian.com/",
    image: "https://inherestudiohoian.com/inhere-logo.jpg",
    description: "Outdoor Áo Dài photography, Vietnamese styling, makeup and outfit rental experiences in Hội An.",
    telephone: "+84 898 199 099",
    address: {
      "@type": "PostalAddress",
      streetAddress: "24 Đào Duy Từ",
      addressLocality: "Hội An",
      addressCountry: "VN",
    },
    areaServed: { "@type": "Place", name: "Hội An" },
    sameAs: [
      "https://www.instagram.com/inhere.studiohoian/",
      "https://www.facebook.com/ThueAoDaiHoiAn.InHere",
      "https://www.tiktok.com/@inhere.studiohoian/",
      "https://www.youtube.com/@Inhere.studioHoiAn",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "INHERE Hội An Experiences",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Full Combo Áo Dài, makeup and outdoor photoshoot", url: "https://inherestudiohoian.com/services" },
        { "@type": "OfferCatalog", name: "Áo Dài outfit rental", url: "https://inherestudiohoian.com/services/outfit-rental" },
      ],
    },
  };
  return <>
    {path === "/" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />}
    <InhereSite initialPath={path} />
  </>;
}
