import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return {
		root: "src/",
		base: process.env.VITE_BASE_URL,
		build: {
			outDir: "../dist"
		},
		plugins: [react()]
	};
});
