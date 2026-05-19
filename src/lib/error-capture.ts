/**
 * Global error capture · 5-second TTL window
 *
 * The h3 swallow only happens inside the framework's request lifecycle.
 * By the time the wrapper in src/server.ts inspects the response and
 * decides it needs the real error, the throw site is already gone.
 *
 * Solution: subscribe to globalThis error events and remember the
 * most recent one. TTL is 5s because longer windows risk leaking
 * one request's error into another's response. Shorter windows risk
 * missing the legitimate target.
 */

type CapturedError = {
  message: string;
  stack?: string;
  capturedAt: number;
};

const TTL_MS = 5_000;
let recent: CapturedError | undefined;
let activated = false;

function record(message: string, stack?: string): void {
  recent = { message, stack, capturedAt: Date.now() };
}

export function startErrorCapture(): void {
  if (activated) return;
  activated = true;

  globalThis.addEventListener?.("error", (event) => {
    const err = (event as ErrorEvent).error;
    if (err instanceof Error) {
      record(err.message, err.stack);
    } else {
      record(String((event as ErrorEvent).message ?? "error"));
    }
  });

  globalThis.addEventListener?.("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    if (reason instanceof Error) {
      record(reason.message, reason.stack);
    } else {
      record(String(reason));
    }
  });
}

export function takeRecentError(): CapturedError | undefined {
  if (!recent) return undefined;
  if (Date.now() - recent.capturedAt > TTL_MS) {
    recent = undefined;
    return undefined;
  }
  const captured = recent;
  recent = undefined; // single-take: don't replay across requests
  return captured;
}
