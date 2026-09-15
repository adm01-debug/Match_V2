import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: [
      // Local imports: "@/..."
      { find: /^@\//, replacement: `${path.resolve(__dirname, "./src")}/` },

      // Force a single React instance (prevents "dispatcher is null" hook crashes)
      { find: /^react$/, replacement: path.resolve(__dirname, "./node_modules/react/index.js") },
      { find: /^react\/jsx-runtime$/, replacement: path.resolve(__dirname, "./node_modules/react/jsx-runtime.js") },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime.js") },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, "./node_modules/react-dom/index.js") },
      { find: /^react-dom\/client$/, replacement: path.resolve(__dirname, "./node_modules/react-dom/client.js") },
    ],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        // rolldown (vite 8) only accepts the function form of manualChunks
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return "vendor";
          if (/node_modules\/@radix-ui\/react-(dialog|slot)\//.test(id)) return "ui";
          if (/node_modules\/@tanstack\/react-query\//.test(id)) return "query";
          if (/node_modules\/recharts\//.test(id)) return "charts";
          if (/node_modules\/@supabase\/supabase-js\//.test(id)) return "supabase";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 8080,
    host: "::",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
}));
