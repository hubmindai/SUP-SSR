/**
 * sitemap.xml builder · sitemaps.org compliant
 *
 * Generates a valid sitemap from a route inventory. In production the
 * agent populates `routes` from the route tree at build time; here we
 * expose the function so a hand-rolled route can call it for a single
 * route's sitemap fragment.
 */

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  /** Absolute URL, including protocol. */
  loc: string;
  /** ISO 8601 date. */
  lastmod?: string;
  changefreq?: ChangeFreq;
  /** 0.0 to 1.0 */
  priority?: number;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemap(entries: SitemapEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`    <loc>${escapeXml(e.loc)}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (typeof e.priority === "number") {
        const clamped = Math.max(0, Math.min(1, e.priority));
        parts.push(`    <priority>${clamped.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

/**
 * Heuristic priority based on URL depth.
 *   /         → 1.0
 *   /foo      → 0.8
 *   /foo/bar  → 0.5
 *   deeper    → 0.3
 */
export function defaultPriority(url: string): number {
  const path = new URL(url).pathname;
  const depth = path.split("/").filter(Boolean).length;
  if (depth === 0) return 1.0;
  if (depth === 1) return 0.8;
  if (depth === 2) return 0.5;
  return 0.3;
}
