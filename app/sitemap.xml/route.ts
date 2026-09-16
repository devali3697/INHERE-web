const origin = "https://inherestudiohoian.com";

const fixedPaths = [
  "/",
  "/services",
  "/services/outfit-rental",
  "/services/solo-photoshoot",
  "/services/couple-photoshoot",
  "/services/family-photoshoot",
  "/services/group-photoshoot",
  "/portfolio",
  "/experiences",
  "/faq",
];

type PublishedArticle = { slug: string };

async function publishedArticles(): Promise<PublishedArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://phqyikcotdmachgvoqyb.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_9SyO3dsyKVWI2M32TKKj9Q_fdmYkEzS";
  try {
    const response = await fetch(`${url}/rest/v1/blog_posts?status=eq.published&select=slug`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) return [];
    return (await response.json()) as PublishedArticle[];
  } catch {
    return [];
  }
}

export async function GET() {
  const articles = await publishedArticles();
  const paths = [...fixedPaths, ...articles.filter((article) => article.slug).map((article) => `/experiences/${encodeURIComponent(article.slug)}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)].map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
