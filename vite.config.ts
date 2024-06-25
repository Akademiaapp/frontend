import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import { manifestGeneratorPlugin } from "sveltekit-adapter-versioned-worker";

export default defineConfig({
	plugins: [sveltekit()]
});
