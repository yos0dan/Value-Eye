import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// GitHub Pages serves from the repo root or a /docs folder.
			// The default output dir 'build' works fine with gh-pages branch deployment.
			fallback: '404.html'
		})
	}
};

export default config;
