import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "index.html"),
                background: resolve(
                    __dirname,
                    "src",
                    "scripts",
                    "service-worker",
                    "background.ts"
                ),
                content: resolve(
                    __dirname,
                    "src",
                    "scripts",
                    "injection",
                    "content.ts"
                ),
            },
            output: {
                entryFileNames: (chunk) => {
                    if (chunk.name === "popup") {
                        return "popup.js";
                    }
                    if (chunk.name === "background") {
                        return "background.js";
                    }
                    if (chunk.name === "content") {
                        return "content.js";
                    }
                    return "[name].js";
                },
            },
        },
    },
});
