import fs from 'fs';
import path from 'path';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		target: '#svelte',
		paths: process.env.USE_BASE_PATH
			? {
					base: '/svelte-editor'
			  }
			: {},
		vite: {
			define: {
				PACKAGE_JSON: JSON.stringify(pkg)
			},
			resolve: {
				alias: {
					'@aicacia/svelte-editor': path.resolve('src/lib')
				}
			}
		}
	}
};

export default config;
