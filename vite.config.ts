import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// --- Логирование (оставляем как было) ---
const PROJECT_ROOT = process.cwd();
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}
function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) return;
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = lines.slice(-Math.floor(lines.length * 0.6)); // Simplified trim
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {}
}
function writeToLogFile(source: string, entries: unknown[]) {
  if (!entries.length) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map(e => `[${new Date().toISOString()}] ${JSON.stringify(e)}`);
  fs.appendFileSync(logPath, lines.join("\n") + "\n", "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
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
  
  // 1. Явно задаем корень проекта в папку client (там, где index.html)
  root: path.join(process.cwd(), "client"),
  
  resolve: {
    alias: {
      // 2. Алиасы строим от реального корня (process.cwd())
      "@": path.join(process.cwd(), "client/src"),
      "@shared": path.join(process.cwd(), "shared"),
      "@assets": path.join(process.cwd(), "attached_assets"),
    },
  },
  
  envDir: process.cwd(), // Переменные окружения ищем в корне репозитория

  build: {
    // 3. Выходная папка - в dist/public в корне репозитория
    outDir: path.join(process.cwd(), "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      // 4. ВАЖНО: Убираем input. Vite сам найдет index.html, так как мы задали root: "client"
      input: undefined, 
    },
  },
  
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["all"], // Упростили для надежности
    fs: {
      strict: false, // Разрешаем доступ к файлам вне корня client (например, node_modules в корне)
    },
  },
});
