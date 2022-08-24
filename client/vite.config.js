import path from "path";
import { defineConfig } from 'vite'

export default defineConfig(() => ({
    build: {
        outDir: path.join(__dirname, "..", "dist"),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                nested: path.resolve(__dirname, "login.html")
            }
        }
    }
}));
