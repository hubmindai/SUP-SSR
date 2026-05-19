import { createStart } from "@tanstack/react-start";

/**
 * Centralized createStart instance so error-handling and middleware
 * compose in one place. The fetchHandler is consumed by src/server.ts.
 */
export const startInstance = createStart(() => {
  return {
    defaultSsr: true,
  };
});

export const errorMiddleware = startInstance.createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    try {
      return await next();
    } catch (err) {
      // Re-throw so the global error-capture in server.ts can record it.
      throw err;
    }
  },
);

// Re-export the framework handler under a stable name for src/server.ts.
export { fetchHandler } from "@tanstack/react-start/server";
