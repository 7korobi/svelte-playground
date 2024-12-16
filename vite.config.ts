import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: [sveltekit()] as any
});
