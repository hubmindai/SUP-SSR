import { createFileRoute, Link } from "@tanstack/react-router";
import {
  webSite,
  faqPage,
  breadcrumb,
  jsonLdScript,
} from "@/lib/seo/json-ld";

const PAGE_URL = "https://example.supacode.dev/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SupaCode Starter — SSR-ready from prompt one" },
      {
        name: "description",
        content:
          "A working TanStack Start scaffold from SupaCode. SSR by default, SEO/AEO scaffolds, Edison-grade error handling, OKLCH design tokens.",
      },
      { property: "og:title", content: "SupaCode Starter" },
      {
        property: "og:description",
        content: "SSR by default · SEO + AEO scaffolds · OKLCH tokens · branded fallback.",
      },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      jsonLdScript(
        webSite({
          name: "SupaCode Starter",
          url: PAGE_URL,
          searchUrlTemplate: `${PAGE_URL}search?q={search_term_string}`,
        }),
      ),
      jsonLdScript(
        breadcrumb([{ name: "Home", url: PAGE_URL }]),
      ),
      jsonLdScript(
        faqPage([
          {
            q: "What does this starter give me?",
            a: "A working TanStack Start app, SSR-ready, with SEO primitives (head, sitemap, robots, canonical, OG) and AEO scaffolds (JSON-LD generators, llms.txt builder) wired up. Brand System v5 tokens in OKLCH. The h3 swallow workaround so SSR errors never reach the user as opaque 500s.",
          },
          {
            q: "How is this different from creating a TanStack Start project directly?",
            a: "Functionally similar to the framework starter, plus opinionated additions from SupaCode's PRD: editorial brand tokens, SEO/AEO toolkit, the h3 swallow workaround, a conservative 7-day supply-chain freshness budget, and ESLint guards against Next.js drift.",
          },
          {
            q: "Where do I deploy this?",
            a: "Cloudflare Pages by default (run `pnpm build` then `wrangler deploy`). CF Workers, Vercel, and Netlify adapter support is on the SupaCode roadmap (project SUP-SSR).",
          },
        ]),
      ),
    ],
  }),
  component: HomeView,
});

function HomeView() {
  return (
    <article className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-coral)] mb-3">
          SupaCode Starter · v0.1
        </p>
        <h1 className="text-6xl italic font-medium leading-[1.02] mb-5">
          SSR-ready from prompt one.
        </h1>
        <p className="text-lg text-[var(--color-ink-soft)] max-w-prose leading-relaxed">
          A working TanStack Start scaffold with SSR, SEO and AEO baked in. Open this file at{" "}
          <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">
            src/routes/index.tsx
          </code>{" "}
          to start editing. The agent does not touch{" "}
          <code className="font-mono text-sm bg-[var(--color-cream-deep)] px-1.5 py-0.5">
            src/routeTree.gen.ts
          </code>
          ; the router regenerates it on every save.
        </p>
        <p className="font-display italic text-2xl text-[var(--color-coral-deep)] mt-6 max-w-prose">
          &ldquo;Aviation visibility check, sir. Pre-flight green across the board.&rdquo;
          <span className="block font-mono not-italic text-xs uppercase tracking-widest text-[var(--color-mute)] mt-2">
            — Edison, the SupaCode persona
          </span>
        </p>
      </header>

      <section>
        <h2 className="text-2xl italic font-medium mb-4">What&rsquo;s in this starter</h2>
        <ul className="space-y-3 max-w-prose">
          {[
            ["SSR by default", "TanStack Start on Cloudflare Workers + Pages. Demo route renders fully on the server; curl it and see meaningful HTML."],
            ["SEO primitives", "Per-route head(). Canonical URLs, Open Graph, robots.txt, sitemap.xml builder. Lighthouse SEO target ≥ 95."],
            ["AEO toolkit", "Eight JSON-LD generators (Organization, WebSite, Article, FAQPage, HowTo, Product, BreadcrumbList, Person). llms.txt builder. Per-page AEO score is on the SupaCode roadmap."],
            ["h3 swallow workaround", "src/server.ts catches the framework's swallowed errors before they reach the user. Branded fallback is a pure string template, no fonts, no CDN."],
            ["Brand System v5 tokens", "OKLCH design tokens. Cream surface, coral accent, square corners, no shadows. Fraunces italic for display, Inter Tight for body, JetBrains Mono for code."],
            ["Conservative supply-chain stance", "7-day freshness budget in bunfig.toml. ESLint bans on Next.js-drift imports and edits to *.gen.ts."],
          ].map(([title, body]) => (
            <li key={title} className="border-l-2 border-[var(--color-coral)] pl-4 py-1">
              <strong className="block">{title}</strong>
              <span className="text-[var(--color-ink-soft)] text-[15px] leading-relaxed">{body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--color-ink)] pt-8">
        <h2 className="text-2xl italic font-medium mb-4">First moves</h2>
        <ol className="space-y-2 max-w-prose font-mono text-sm">
          <li>
            <span className="text-[var(--color-coral)]">1 ·</span> Edit{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">src/routes/index.tsx</code> to change this page.
          </li>
          <li>
            <span className="text-[var(--color-coral)]">2 ·</span> Add a new route by creating{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">src/routes/your-route.tsx</code>.
          </li>
          <li>
            <span className="text-[var(--color-coral)]">3 ·</span> Pull in a shadcn primitive:{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">npx shadcn@latest add button</code>.
          </li>
          <li>
            <span className="text-[var(--color-coral)]">4 ·</span> Run{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">pnpm dev</code> to start the dev server.
          </li>
          <li>
            <span className="text-[var(--color-coral)]">5 ·</span>{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">pnpm build</code> then{" "}
            <code className="bg-[var(--color-cream-deep)] px-1.5 py-0.5">wrangler deploy</code> to ship.
          </li>
        </ol>
      </section>

      <section className="border-t border-[var(--color-ink)] pt-8">
        <Link
          to="/about"
          className="inline-flex items-baseline gap-2 text-[var(--color-coral-deep)] underline underline-offset-4"
        >
          About this starter and the SUP-SSR project →
        </Link>
      </section>
    </article>
  );
}
