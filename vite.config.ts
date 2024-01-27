import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return {
		root: "src/",
		base: process.env.VITE_BASE_URL,
		build: {
			emptyOutDir: true,
			outDir: "../dist",
			rollupOptions: {
			  input: {
				index: resolve(import.meta.dirname, 'src/index.html'),
				decoder: resolve(import.meta.dirname, 'src/decoder/index.html'),
				generator: resolve(import.meta.dirname, 'src/generator/Generator.html')
			  }
			}
		},
		plugins: [react()]
	};
});
