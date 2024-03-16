import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return {
		root: "src/",
		build: {
			outDir: "../dist"
		}
	};
});
