import { parseHashRoute } from './parseHashRoute.js';
import { routeMap } from './routeMap.js';

export function startRouter(appRoot) {
	AppRouter.init(appRoot);
}

export const AppRouter = {
	init(appRoot) {
		// Handle first render
		this.handleRouteChange(appRoot);

		// Handle future hash changes
		window.addEventListener('hashchange', () =>
			this.handleRouteChange(appRoot)
		);

		this.handleRouteChange(appRoot);
	},

	/**
	 * Handle hash changes
	 * @param {HTMLElement} appRoot
	 */

	handleRouteChange(appRoot) {
		const hash = window.location.hash;
		/** @type {{path: string, params: Record<string,string> | {}}} */
		const { path, params } = parseHashRoute(hash);
		const entry = routeMap[path] || routeMap['/404'];

		entry.handler(appRoot, path, params);
		if (entry.title) {
			document.title = entry.title;
		}
	}
};
