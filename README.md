# SupaCode Starter

> A working TanStack Start scaffold from SupaCode. SSR by default, SEO and AEO baked in, Brand System v5 design tokens in OKLCH, and the h3 swallow workaround so server errors never reach the user as opaque 500s.

This starter is the runnable companion to the [SUP-SSR PRD](https://supacode.dev/) — SupaCode's response to Lovable's May 13, 2026 stack migration. Every file in this repo maps to a decision in that document.

---

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. The demo home page renders fully on the server — `curl http://localhost:5173 | grep '<title>'` shows the page title in the HTML, no JS hydration required.

### Deploy to Cloudflare Pages

```bash
pnpm build
wrangler deploy
```

You'll need a free Cloudflare account and `wrangler login` once. The starter is configured to use Workers Assets with SPA-fallback routing.

---

## What's in this starter

```
supacode-starter/
├── src/
│   ├── routes/              # File-based routing (TanStack Router)
│   │   ├── __root.tsx       # Root layout, head(), Organization JSON-LD
│   │   ├── index.tsx        # Home — WebSite + FAQPage + Breadcrumb JSON-LD
│   │   └── about.tsx        # About — Article + Breadcrumb JSON-LD
│   ├── lib/
│   │   ├── error-capture.ts # Global error listener · 5s TTL
│   │   ├── error-page.ts    # Pure-string branded fallback
│   │   ├── utils.ts         # cn() helper
│   │   └── seo/
│   │       ├── json-ld.ts   # 8 schema.org generators
│   │       ├── llms-txt.ts  # llms.txt + llms-full.txt builder
│   │       ├── sitemap.ts   # sitemap.xml builder
│   │       └── robots.ts    # robots.txt builder
│   ├── components/ui/       # shadcn primitives, Brand v5 tokenized
│   ├── server.ts            # h3 swallow workaround · the cleverest file
│   ├── start.ts             # createStart + errorMiddleware
│   ├── router.tsx           # createRouter
│   └── styles.css           # Tailwind v4 + OKLCH tokens
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── llms.txt
├── vite.config.ts           # Plugin composition (becomes 3 lines once wrapper ships)
├── wrangler.jsonc           # CF Workers/Pages config
├── bunfig.toml              # 7-day freshness budget
├── components.json          # shadcn/ui · new-york style
├── eslint.config.js         # Bans on Next.js drift + *.gen.ts edits
└── tsconfig.json            # Bundler mode, strict, @/* alias
```

---

## Five things to know before you start editing

### 1 · The wrapper is coming

Right now `vite.config.ts` is verbose because we inline every plugin (TanStack Router, TanStack Start, React, Tailwind v4, Cloudflare, tsconfig paths). Once `@supacode/vite-tanstack-config` ships (SUP-SSR-001 in the PRD), this file collapses to three lines:

```ts
import { defineConfig } from "@supacode/vite-tanstack-config";
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
});
```

The wrapper will be MIT-licensed on npm. Distribution leverage > secrecy.

### 2 · Never edit `*.gen.ts` files

TanStack Router regenerates `src/routeTree.gen.ts` on every save. Edits get silently overwritten. ESLint flags edits as errors. The agent has a hard guard too. If you need to change route structure, edit the route files themselves; the generated tree updates.

### 3 · Server errors are caught

The framework's underlying HTTP layer (h3) swallows in-handler throws into a generic 500 with a JSON body that says `{"unhandled":true,"message":"HTTPError"}`. A naive try/catch around the fetch handler never sees the real error. `src/server.ts` does three things to fix this:

1. Subscribes to `globalThis` `error` and `unhandledrejection` events with a 5-second TTL window
2. Inspects every response with status ≥ 500 — if the body matches the swallow signature, it was a real error h3 ate
3. Renders the branded fallback in `src/lib/error-page.ts` — pure string template, no React, no fonts, no CDN

To test it: throw from a route loader. You'll get the branded fallback, not an opaque 500.

### 4 · SEO and AEO live in `src/lib/seo`

Per-route SEO is driven by TanStack Start's `head()` function. Open `src/routes/index.tsx` to see the pattern:

```ts
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "..." }, { name: "description", content: "..." }],
    links: [{ rel: "canonical", href: "..." }],
    scripts: [
      jsonLdScript(webSite({ name: "...", url: "..." })),
      jsonLdScript(faqPage([{ q: "...", a: "..." }])),
    ],
  }),
  component: HomeView,
});
```

Eight JSON-LD generators are exported from `@/lib/seo/json-ld`:

| Generator | When to use it |
| -------- | -------------- |
| `organization()` | Site-wide, in the root layout |
| `webSite()` | Home page; adds SearchAction if you have site search |
| `article()` | Blog posts, articles, news |
| `faqPage()` | Pages with question-and-answer sections |
| `howTo()` | Step-by-step tutorials |
| `product()` | Product pages, wired to SupaPay pricing where available |
| `breadcrumb()` | Every page beyond the home |
| `person()` | About pages, author pages |

The llms.txt builder (`src/lib/seo/llms-txt.ts`) and sitemap builder (`src/lib/seo/sitemap.ts`) are stub-implementations of the SUP-SSR-008 / SUP-SSR-012 toolkit. In a full SupaCode build the agent generates these at build time from the route tree.

### 5 · The supply-chain stance is conservative

`bunfig.toml` sets `minimumReleaseAge = 604800` — seven days. New npm packages can't be installed until they've been on the registry for a week. This is intentional: post-xz, post-event-stream, post-Shai-Hulud, the cost of a malicious package landing in your dependency tree is high. The seven-day budget gives the ecosystem time to spot bad releases.

If you genuinely need a same-day install, add the package to `minimumReleaseAgeExcludes` — but treat that as an audited decision, not a default move.

---

## Common moves

### Add a new route

Create `src/routes/your-route.tsx`:

```ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/your-route")({
  head: () => ({
    meta: [{ title: "Your route title" }],
    links: [{ rel: "canonical", href: "https://your-site.com/your-route" }],
  }),
  component: () => <div>Hello</div>,
});
```

The route tree regenerates automatically. Link to it with `<Link to="/your-route" />`.

### Add a shadcn primitive

```bash
npx shadcn@latest add dialog
```

It lands in `src/components/ui/dialog.tsx` and respects the design tokens.

### Change the brand colors

Edit `src/styles.css`. All color tokens are OKLCH. Keep chroma below ~0.2 to stay within sRGB gamut for all common displays. Coral (`oklch(0.624 0.179 35)`) is at the practical maximum for that hue range.

### Run the type checker and lint

```bash
pnpm typecheck
pnpm lint
```

---

## Where SupaCode goes next

This starter is v0.1 of the SupaCode SSR scaffold. The full SupaCode v0.6 platform — outlined in the SUP-SSR PRD — adds:

- **The Edison SEO Agent**: multi-agent stack (Opus orchestrator + 3 Sonnet domain agents + Haiku scouts) with stigmergic memory across sessions
- **The Discoverability dashboard**: per-page AEO score, keyword rank monitoring, AI citation tracking, one-click fix engine
- **Multi-runtime adapters**: same source tree deploys to CF Pages, CF Workers, Vercel, and Netlify
- **The migration path**: pre-render fallback for legacy SPAs (Path A) and a guided upgrade wizard (Path B)
- **SupaPay-on-SSR**: native commerce with Product schema markup wired to live pricing

Public launch: August 4, 2026.

---

## Brand voice in this starter

You'll notice phrases like *"Aviation visibility check, sir"* — that's **Edison**, the SupaCode persona. British butler register with a Rocky tic, aviation vocabulary used with restraint. Edison appears in the error fallback, the 404, and the demo home page so you can see the voice in context. Replace it with your own copy when you build your real app; or keep it if you like the register.

---

## License

MIT. Build whatever you want with this. Attribution is appreciated but not required.

— SupaCode
