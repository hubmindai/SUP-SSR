/**
 * Branded SSR error fallback · pure string template
 *
 * Zero network calls. No fonts, no React, no CDN. The floor that renders
 * when everything else has failed. SupaCode voice. Edison-adjacent.
 */
export function renderErrorPage(_message: string): string {
  // We intentionally do NOT surface the raw error message to the user.
  // Real diagnostics live in the server logs (console.error in server.ts).
  // The page reassures, not debugs.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Something went sideways · SupaCode</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; background: #F4F4F1; color: #1A1A1A; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: grid; place-items: center; padding: 2rem;
    }
    .wrap { max-width: 32rem; }
    .tag {
      font-family: ui-monospace, Menlo, monospace;
      font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
      color: #D85A3E; margin-bottom: 1.25rem;
    }
    h1 {
      font-family: Georgia, "Times New Roman", serif;
      font-style: italic; font-weight: 500;
      font-size: clamp(2rem, 5vw, 3rem); line-height: 1.05;
      margin-bottom: 1rem;
    }
    p { font-size: 1rem; line-height: 1.55; color: #2E2E2C; margin-bottom: 1rem; max-width: 50ch; }
    a {
      display: inline-block; margin-top: 1rem;
      color: #D85A3E; text-decoration: underline; text-underline-offset: 4px;
      font-weight: 500;
    }
    .quiet {
      font-family: ui-monospace, Menlo, monospace;
      font-size: 0.7rem; color: #8E8B82; margin-top: 2rem;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <p class="tag">SSR · Unscheduled descent</p>
    <h1>Something went sideways on our end.</h1>
    <p>Aviation visibility check, sir &mdash; our SSR pipeline raised a flag we didn't catch in time. Your data is safe; the page itself just didn't make it through.</p>
    <p>A retry usually clears it. If it doesn't, the engineering crew has already been notified.</p>
    <a href="/">Return to safe altitude →</a>
    <p class="quiet">SupaCode · branded fallback &middot; rendered offline at the edge</p>
  </main>
</body>
</html>`;
}
