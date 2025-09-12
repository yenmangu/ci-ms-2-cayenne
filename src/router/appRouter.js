import { parseHashRoute } from './parseHashRoute.js';
import { routeMap } from './routeMap.js';

export function startRouter(appRoot) {
	AppRouter.init(appRoot);
}

export const AppRouter = {
	init(appRoot) {
		this.appRoot = appRoot;

		window.addEventListener('hashchange', () => this.handleRouteChange());

		this.handleRouteChange();
	},

	/**
	 * Handle hash changes
	 */

	handleRouteChange() {
		const hash = window.location.hash;
		/** @type {{path: string, params: Record<string,string> | {}}} */
		const { path, params } = parseHashRoute(hash);

		const route = routeMap[path];
		const routeHandler = route?.handler;

		if (typeof routeHandler === 'function') {
			routeHandler(this.appRoot, params);
		} else {
			const fallbackRoute = '404';
			routeMap[fallbackRoute].handler(this.appRoot, {});
		}
	}
};
