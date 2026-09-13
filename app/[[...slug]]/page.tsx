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
  return <InhereSite initialPath={`/${slug.join("/")}`} />;
}
