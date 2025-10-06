import { parseHashRoute } from './parseHashRoute.js';
import { routeMap } from './routeMap.js';

export function startRouter(appRoot) {
	console.log('Init appRouter');

	AppRouter.init(appRoot);
}

export const AppRouter = {
	init(appRoot) {
		console.log('inside init(appRouter)');

		// Handle first render
		this.handleRouteChange(appRoot);

		// Handle future hash changes
		window.addEventListener('hashchange', () =>
			this.handleRouteChange(appRoot)
		);
	},

	/**
	 * Handle hash changes
	 * @param {HTMLElement} appRoot
	 */

	handleRouteChange(appRoot) {
		console.log('Handling route change');

		const hash = window.location.hash;
		/** @type {{path: string, params: Record<string,string> | {}}} */
		const { path, params } = parseHashRoute(hash);
		console.log('Params: ', params);
		console.log('path: ', path);

		const isDev = params['dev'] === 'true' || params['dev'] === '1';

		const entry = routeMap[path] || routeMap['/404'];

		entry.handler(appRoot, path, { ...params, dev: isDev });
		if (entry.title) {
			document.title = entry.title;
		}
	},

	/**
	 *
	 * @param {string} path
	 * @param {Record<string, *>} [params]
	 */
	navigate(path, params = {}) {
		/** @type {Record<string, *>} */
		const serialised = params;
		// for (const [k, v] of Object.entries(params)) {
		// 	serialised[k] = Array.isArray(v) ? v.join(',') : v;
		// }

		const qs = Object.keys(serialised).length
			? '?' + new URLSearchParams(serialised).toString()
			: '';

		window.location.hash = `#${path}${qs}`;
	}
};

/**
 *
 * @param {(
 * 	appRoot: HTMLElement,
 * 	params: Record<string,string> |{},
 * 	pathName: string,
 * 	)=> void
 * } ComponentClass
 * @returns {import('../types/routerTypes.js').RouteHandler}
 */
export function withComponent(ComponentClass) {
	return (appRoot, pathName, params = {}) => {
		const instance = new ComponentClass(appRoot, params, pathName);
		instance.render();
	};
}
