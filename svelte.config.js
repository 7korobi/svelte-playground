import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.

		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// adapter: adapter()

		// adapter-cloudflare is a good default for Cloudflare Workers Sites
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			platformProxy: {
				configPath: 'wrangler.toml',
				environment: undefined,
				experimentalJsonConfig: false,
				persist: false
			}
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
