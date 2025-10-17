/**
 * @typedef {import('../types/routerTypes.js').ComponentInstance} Component
 */

import { appStore } from '../appStore.js';
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

	// Track last active route and current instances
	/** @type {string} */
	lastActivePath: '',
	/** @type {Record<string,Component>} */
	currentInstances: {},

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

		// Handle automatic teardown to avoid memory leak
		let lastPath = AppRouter.lastActivePath;
		const lastInstance = AppRouter.currentInstances[lastPath];
		if (lastInstance && typeof lastInstance.destroy === 'function') {
			console.log('Destroying instance: ', lastInstance);
			lastInstance.destroy();

			delete AppRouter.currentInstances[lastPath];
		}

		appStore.setState({ route: entry });

		const component = entry.handler(appRoot, path, { ...params, dev: isDev });

		// Ensure all return values are treated as resolves promises.

		Promise.resolve(component).then(
			/** @param {Component} instance */ instance => {
				if (instance && typeof instance.destroy === 'function')
					AppRouter.currentInstances[path] = instance || null;
			}
		);

		// entry.handler(appRoot, path, { ...params, dev: isDev });
		if (entry.title) {
			document.title = entry.title;
		}

		// Assign new path to last active path for next navigation
		AppRouter.lastActivePath = path;
	},

	destroyAllInstances() {
		Object.values(AppRouter.currentInstances).forEach(instance => {
			if (instance && typeof instance.destroy === 'function') {
				instance.destroy();
			}
		});
		AppRouter.currentInstances = {};
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
