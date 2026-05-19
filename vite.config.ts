import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";

/**
 * SupaCode starter · vite config
 *
 * Once `@supacode/vite-tanstack-config` ships (SUP-SSR-001), this file
 * becomes three lines:
 *
 *   import { defineConfig } from "@supacode/vite-tanstack-config";
 *   export default defineConfig({ tanstackStart: { server: { entry: "server" } } });
 *
 * Until then, the wrapper's behavior is inlined here so the starter works today.
 */
export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    viteReact(),
    tanstackStart({
      server: { entry: "server" },
    }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  envPrefix: ["VITE_", "PUBLIC_"],
});
