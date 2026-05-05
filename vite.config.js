import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Only show errors in the console (no warnings)
  logLevel: "error",

  // Plugins used in this project
  plugins: [
    react(), // Enables React support
  ],
});
