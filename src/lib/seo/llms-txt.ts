/**
 * llms.txt builder · llmstxt.org proposed standard
 *
 * Two formats:
 *   - buildLlmsTxt(): concise index for /llms.txt
 *   - buildLlmsFullTxt(): expanded with page content for /llms-full.txt
 *
 * Both consume a structured site description. In a full SupaCode build,
 * the agent populates this from the route tree + extracted page content.
 * Here we expose the function signature; integration with the build
 * pipeline ships in @supacode/seo-toolkit (SUP-SSR-012).
 */

export interface LlmsTxtSection {
  title: string;
  items: { name: string; url: string; description?: string }[];
}

export interface LlmsTxtInput {
  siteName: string;
  oneLineDescription: string;
  sections: LlmsTxtSection[];
  notes?: string[];
}

export interface LlmsFullTxtPage {
  url: string;
  title: string;
  markdown: string; // pre-extracted page content, boilerplate stripped
}

export interface LlmsFullTxtInput extends LlmsTxtInput {
  pages: LlmsFullTxtPage[];
}

export function buildLlmsTxt(input: LlmsTxtInput): string {
  const lines: string[] = [];
  lines.push(`# ${input.siteName}`);
  lines.push(`> ${input.oneLineDescription}`);
  lines.push("");

  for (const section of input.sections) {
    lines.push(`## ${section.title}`);
    for (const item of section.items) {
      const desc = item.description ? `: ${item.description}` : "";
      lines.push(`- [${item.name}](${item.url})${desc}`);
    }
    lines.push("");
  }

  if (input.notes && input.notes.length > 0) {
    lines.push("## Notes");
    for (const note of input.notes) lines.push(`- ${note}`);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

export function buildLlmsFullTxt(input: LlmsFullTxtInput): string {
  const lines: string[] = [];
  lines.push(`# ${input.siteName}`);
  lines.push(`> ${input.oneLineDescription}`);
  lines.push("");
  lines.push("This is the expanded llms-full.txt with full page content.");
  lines.push("");

  for (const page of input.pages) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`# ${page.title}`);
    lines.push(`<!-- url: ${page.url} -->`);
    lines.push(``);
    lines.push(page.markdown.trim());
    lines.push(``);
  }

  return lines.join("\n").trim() + "\n";
}
