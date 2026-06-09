import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/components", replacement: path.resolve(__dirname, "../../shared/components") },
      { find: "@/constants", replacement: path.resolve(__dirname, "../../shared/constants") },
      { find: "@/helpers", replacement: path.resolve(__dirname, "../../shared/helpers") },
      { find: "@/hooks", replacement: path.resolve(__dirname, "../../shared/hooks") },
      { find: "@/lib", replacement: path.resolve(__dirname, "../../shared/lib") },
      { find: "@/services", replacement: path.resolve(__dirname, "../../shared/services") },
      { find: "@/types", replacement: path.resolve(__dirname, "../../shared/types") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  server: {
    fs: {
      allow: ["../.."]
    }
  }
})
