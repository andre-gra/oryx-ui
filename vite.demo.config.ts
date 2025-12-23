import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, __dirname, "VITE_");

  return {
    define: {
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY
      ),
    },
    plugins: [react()],
    root: resolve(__dirname, "demo"),
    resolve: {
      alias: {
        "oryx-ui": resolve(__dirname, "src"),
      },
    },
  };
});