import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// --- Логирование ---
const PROJECT_ROOT = process.cwd();
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");

function writeToLogFile(source: string, entries: unknown[]) {
  if (!entries.length) return;
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map(e => `[${new Date().toISOString()}] ${JSON.stringify(e)}`);
  fs.appendFileSync(logPath, lines.join("\n") + "\n", "utf-8");
}

function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") return html;
      return { html, tags: [{ tag: "script", attrs: { src: "/__manus__/debug-collector.js", defer: true }, injectTo: "head" }] };
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", c => body += c);
        req.on("end", () => {
          try {
            const p = JSON.parse(body);
            if (p.consoleLogs) writeToLogFile("browserConsole", p.consoleLogs);
            if (p.networkRequests) writeToLogFile("networkRequests", p.networkRequests);
            if (p.sessionEvents) writeToLogFile("sessionReplay", p.sessionEvents);
            res.writeHead(200); res.end(JSON.stringify({ success: true }));
          } catch { res.writeHead(400); res.end(); }
        });
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];

export default defineConfig({
  plugins,
  // МЫ УБРАЛИ ROOT! Vite будет работать в текущей папке (где лежит index.html)
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"), 
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  envDir: process.cwd(),
  build: {
    outDir: "dist", // Просто dist
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["all"],
  },
});
