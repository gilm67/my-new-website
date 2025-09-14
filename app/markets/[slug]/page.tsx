// app/markets/[slug]/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import MarketPage from "@/site/components/MarketPage"; // ✅ use tsconfig alias
import { getMarket, marketSlugs } from "@/lib/markets";

/* ------------ Static params for SSG ------------ */
export async function generateStaticParams() {
  return marketSlugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

/* ------------ SEO metadata per market (await params) ------------ */
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const m = getMarket(slug);
  if (!m) return {};
  const title = `Private Banking Recruitment in ${m.name} | Executive Partners`;
  const description = `${m.name} market insight: hiring pulse, regulatory must-haves, compensation bands, and ecosystem overview.`;
  const url = `https://www.execpartners.ch/markets/${m.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ------------ Page (await params) ------------ */
export default async function Market(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const m = getMarket(slug);
  if (!m) return <p className="text-red-500">Market not found</p>;

  // Breadcrumbs JSON-LD
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Executive Partners", item: "https://www.execpartners.ch/" },
      { "@type": "ListItem", position: 2, name: "Markets We Serve", item: "https://www.execpartners.ch/markets" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://www.execpartners.ch/markets/${m.slug}` },
    ],
  };

  return (
    <>
      <Script id="breadcrumbs-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <MarketPage m={m} />
    </>
  );
}
