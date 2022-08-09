import path from "path";
import { defineConfig } from 'vite'

export default defineConfig(() => ({
    build: {
        outDir: path.join(__dirname, "..", "dist"),
    }
}));
