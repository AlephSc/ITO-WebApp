import { defineConfig } from "vite";

export default defineConfig({
  server: { host: true },
  build: {
    target: "es2022",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) {
            return "three";
          }
          if (id.includes("node_modules/gsap") || id.includes("node_modules/lenis")) {
            return "vendor";
          }
        }
      }
    }
  }
});
