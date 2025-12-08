import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "OryxUI",
      formats: ["es", "umd"],
      fileName: "oryx-ui",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "oryx.css";
          }
          return assetInfo.name || "asset";
        },
      },
    },
    cssCodeSplit: false,
  },
});
