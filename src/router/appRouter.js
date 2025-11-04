/**
 * @typedef {import('../types/componentTypes.js').ComponentLike} ComponentLike
 * @typedef {import('../types/componentTypes.js').Ctor<ComponentLike>} ComponentCtor
 * - aliased from Ctor
 * @typedef {import('../types/routerTypes.js').RouteHandler} RouteHandler
 */

import { appStore } from '../appStore.js';
import { normaliseParams } from './paramValidator.js';
import { parseHashRoute } from './parseHashRoute.js';
import { NOT_FOUND, routeMap } from './routeMap.js';
import { routerService } from './routerService.js';

/**
 *
 * @param {string} path
 * @param {Record<string, any>} [rawParams]
 */
function resolveRoute(path, rawParams = {}) {
	const params = normaliseParams(rawParams);

	const fallback = routeMap[NOT_FOUND];

	const entry = routeMap[path] || fallback;
	const direct = routeMap[path];

	// Does validate exist and is type 'function'
	if (entry && typeof entry.validate === 'function') {
		const ok = entry.validate(params);
		if (!ok)
			return {
				entry: fallback,
				resolvedPath: NOT_FOUND,
				params
			};
	}
	const resolvedPath = direct ? path : NOT_FOUND;
	return {
		entry,
		resolvedPath,
		params
	};
}

export const startRouter = appRoot => AppRouter.init(appRoot);

export const AppRouter = {
	init(appRoot) {
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
	/** @type {Record<string, ComponentLike | null>} */
	currentInstances: {},

	/**
	 * Handle hash changes
	 * @param {HTMLElement} appRoot
	 */
	handleRouteChange(appRoot) {
		const hash = window.location.hash;
		/** @type {{path: string, params: Record<string,string> | {}}} */
		const { path, params: raw } = parseHashRoute(hash);

		const isDev = raw['dev'] === 'true' || raw['dev'] === '1';

		const { entry, resolvedPath, params } = resolveRoute(path, raw);

		console.log(entry, '\n', resolvedPath, '\n', params);

		routerService.setActiveRouteKey(path);

		const last = this.currentInstances[this.lastActivePath];
		if (last?.destroy) last.destroy();

		delete this.currentInstances[this.lastActivePath];

		appStore.setState({ route: entry });

		const maybeInstance = entry.handler(appRoot, resolvedPath, {
			...params,
			dev: isDev
		});

		// Ensure all return values are treated as resolves promises.

		Promise.resolve(maybeInstance).then(
			/** @param {ComponentLike} instance */ instance => {
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
		// routerService.setActiveRouteKey(path); WAS HERE
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

		const qs = Object.keys(serialised).length
			? '?' + new URLSearchParams(serialised).toString()
			: '';

		window.location.hash = `#${path}${qs}`;
	}
};

/**
 *
 * @param {ComponentCtor} ComponentClass
 */
export function withComponent(ComponentClass) {
	return (appRoot, pathName = '', params = {}) => {
		const instance = new ComponentClass(appRoot, pathName, params);
		instance.render();
		return instance;
	};
}
