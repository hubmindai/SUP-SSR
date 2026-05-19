/**
 * robots.txt builder
 */
export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsInput {
  rules?: RobotsRule[];
  /** Absolute URL to the sitemap. */
  sitemap?: string;
}

export function buildRobotsTxt(input: RobotsInput = {}): string {
  const lines: string[] = [];
  const rules =
    input.rules && input.rules.length > 0
      ? input.rules
      : [{ userAgent: "*", allow: ["/"] }];

  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`);
    for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`);
    if (typeof rule.crawlDelay === "number") {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }
    lines.push("");
  }

  if (input.sitemap) lines.push(`Sitemap: ${input.sitemap}`);
  return lines.join("\n").trim() + "\n";
}
