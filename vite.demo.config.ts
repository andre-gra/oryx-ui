import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "demo"),
  resolve: {
    alias: {
      "oryx-ui": resolve(__dirname, "src"),
    },
  },
});
