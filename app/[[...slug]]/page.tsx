import InhereSite from "../site";

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <InhereSite initialPath={`/${slug.join("/")}`} />;
}
