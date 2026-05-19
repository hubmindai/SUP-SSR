import { createFileRoute, Link } from "@tanstack/react-router";
import {
  article,
  breadcrumb,
  jsonLdScript,
} from "@/lib/seo/json-ld";

const SITE_URL = "https://example.supacode.dev";
const PAGE_URL = `${SITE_URL}/about`;
const PUBLISHED = "2026-05-18";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About this starter — SupaCode" },
      {
        name: "description",
        content:
          "What's in the SupaCode starter, how it maps to the SUP-SSR project, and why it ships the way it does.",
      },
      { property: "og:title", content: "About this starter — SupaCode" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      jsonLdScript(
        article({
          headline: "About the SupaCode starter",
          description:
            "What's in the SupaCode starter and how it maps to the SUP-SSR project.",
          author: { name: "SupaCode" },
          datePublished: PUBLISHED,
          publisher: { name: "SupaCode", logo: `${SITE_URL}/favicon.svg` },
          url: PAGE_URL,
        }),
      ),
      jsonLdScript(
        breadcrumb([
          { name: "Home", url: `${SITE_URL}/` },
          { name: "About", url: PAGE_URL },
        ]),
      ),
    ],
  }),
  component: AboutView,
});

function AboutView() {
  return (
    <article className="space-y-8 max-w-prose">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-coral)] mb-3">
          About · the starter
        </p>
        <h1 className="text-5xl italic font-medium leading-[1.05] mb-4">
          What you&rsquo;re actually getting.
        </h1>
        <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">
          This starter mirrors the architectural decisions made in the SUP-SSR PRD
          &mdash; the SupaCode response to Lovable&rsquo;s May 13 stack migration.
          Same SSR floor, same h3 swallow workaround, same OKLCH design tokens
          &mdash; with our deeper SEO/AEO toolkit and a more conservative
          supply-chain default.
        </p>
      </header>

      <section>
        <h2 className="text-2xl italic font-medium mb-3">Five things to know</h2>
        <ol className="space-y-3">
          <li>
            <strong>The wrapper is coming.</strong> The verbose{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">vite.config.ts</code>{" "}
            collapses to three lines once{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">
              @supacode/vite-tanstack-config
            </code>{" "}
            ships (SUP-SSR-001). MIT-licensed; usable outside SupaCode too.
          </li>
          <li>
            <strong>Never edit *.gen.ts files.</strong> TanStack Router regenerates them on
            every save. ESLint flags edits as errors.
          </li>
          <li>
            <strong>Server errors are caught.</strong> Throw from any handler &mdash; the wrapper
            in{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">src/server.ts</code>{" "}
            inspects 500-class responses, recovers the real error, and renders a
            branded fallback. No more opaque{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">
              {`{"unhandled":true,"message":"HTTPError"}`}
            </code>{" "}
            payloads reaching the user.
          </li>
          <li>
            <strong>SEO and AEO are in{" "}
              <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">src/lib/seo</code>.</strong>{" "}
            Eight JSON-LD generators, an{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">llms.txt</code>{" "}
            builder, a sitemap.xml builder, a robots.txt builder. Wire them through
            per-route{" "}
            <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">head()</code>{" "}
            functions.
          </li>
          <li>
            <strong>Supply-chain stance is conservative, not aggressive.</strong>{" "}
            7-day freshness budget by default (versus Lovable&rsquo;s 24h). Override
            per package, with audit trail.
          </li>
        </ol>
      </section>

      <section className="border-t border-[var(--color-ink)] pt-6">
        <Link to="/" className="text-[var(--color-coral-deep)] underline underline-offset-4">
          ← Back to home
        </Link>
      </section>
    </article>
  );
}
