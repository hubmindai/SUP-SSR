/**
 * SupaCode SSR entry · src/server.ts
 *
 * Why this file looks unusual:
 *
 * TanStack Start's underlying HTTP layer (h3) swallows in-handler throws
 * into a generic 500 response whose JSON body is:
 *
 *   { "unhandled": true, "message": "HTTPError" }
 *
 * A naive try/catch around `fetch` never sees the real error. The real
 * stack trace vanishes; the user sees an opaque 500.
 *
 * Workaround (SUP-SSR-003, adopted verbatim from the Lovable forensic read,
 * cleaned and rebranded):
 *
 *   1. Subscribe to `globalThis` `error` + `unhandledrejection`.
 *      Capture details with 5-second TTL.
 *   2. Wrap the framework fetch handler. Inspect any response with
 *      status >= 500; if the body matches the swallow signature, this
 *      was a real error h3 ate.
 *   3. Render the branded fallback page (src/lib/error-page.ts).
 *      Pure string template. No React, no fonts, no CDN calls.
 *      Works offline at the edge.
 */

import { errorMiddleware, fetchHandler } from "./start";
import { startErrorCapture, takeRecentError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Activate the global capture before any request can be processed.
startErrorCapture();

const SWALLOW_SIGNATURE_FIELDS = {
  unhandled: true as const,
  message: "HTTPError" as const,
};

function isCatastrophicSsrErrorBody(body: string, status: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }
  if (!payload || typeof payload !== "object") return false;
  const fields = payload as Record<string, unknown>;
  return (
    fields.unhandled === SWALLOW_SIGNATURE_FIELDS.unhandled &&
    fields.message === SWALLOW_SIGNATURE_FIELDS.message &&
    (fields.status === undefined || fields.status === status)
  );
}

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await fetchHandler(request, env, ctx);

      if (response.status >= 500) {
        // Clone before reading, so the original stream stays consumable
        // in case we decide not to substitute.
        const clone = response.clone();
        const text = await clone.text();
        if (isCatastrophicSsrErrorBody(text, response.status)) {
          const captured = takeRecentError();
          if (captured) {
            console.error("[SupaCode SSR] Recovered swallowed error:", captured.stack ?? captured.message);
          }
          return new Response(renderErrorPage(captured?.message ?? "Server error"), {
            status: 500,
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
      }

      return response;
    } catch (err) {
      // Belt-and-braces: if the framework throws before producing any response,
      // render the branded fallback rather than letting the runtime emit a generic 500.
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("[SupaCode SSR] Unhandled fetch error:", error.stack ?? error.message);
      return new Response(renderErrorPage(error.message), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

// Export middleware too so error-handling composes with TanStack Start's createStart.
export { errorMiddleware };
