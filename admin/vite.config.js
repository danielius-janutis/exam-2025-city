import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  // Expose dev server outside the container for Docker Compose (maps to host port 81)
  server: {
    host: true,
    port: 81,
    strictPort: true,
  },
});
