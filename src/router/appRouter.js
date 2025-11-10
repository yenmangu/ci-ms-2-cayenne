/**
 * @typedef {import('../types/componentTypes.js').ComponentLike} ComponentLike
 * @typedef {import('../types/componentTypes.js').Ctor<ComponentLike>} ComponentCtor
 * - aliased from Ctor
 * @typedef {import('../types/routerTypes.js').RouteHandler} RouteHandler
 * @typedef {import('../types/errorTypes.js').ErrorScope} ErrorScope
 */

import { appStore } from '../appStore.js';
import { EVENTS } from '../config/events.js';
import { ErrorController } from '../error/error-component/error.controller.js';
import { createErrorPublishing } from '../error/pipe/publishFactory.js';
import {
	getCurrentRouteScope,
	makeRouteScope
} from '../error/util/errorScope.js';
import { normaliseParams } from './paramValidator.js';
import { parseHashRoute } from './parseHashRoute.js';
import { NOT_FOUND, routeMap } from './routeMap.js';
import { routerService } from './routerService.js';

let cleanupRetryListener = null;

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
		console.log('[resolveRoute]: ', 'okay: ', ok);

		if (!ok)
			return {
				entry: fallback,
				params,
				resolvedPath: NOT_FOUND
			};
	}
	const resolvedPath = direct ? path : NOT_FOUND;
	return {
		entry,
		params,
		resolvedPath
	};
}

export const startRouter = appRoot => {
	AppRouter.init(appRoot);
	armRetry(appRoot);
	return AppRouter;
};

export const AppRouter = {
	/** @type {ErrorController | null} */
	_routeErrorController: null,

	/** @type {Record<string, ComponentLike | null>} */
	currentInstances: {},

	destroyAllInstances() {
		Object.values(AppRouter.currentInstances).forEach(instance => {
			if (instance && typeof instance.destroy === 'function') {
				instance.destroy();
			}
		});
		AppRouter.currentInstances = {};
		if (this._routeErrorController) {
			this._routeErrorController.destroy();
			this._routeErrorController = null;
		}
	},

	/**
	 * Handle hash changes
	 * @param {HTMLElement} appRoot
	 */
	handleRouteChange(appRoot) {
		console.log('Handling route change');

		const pubs = createErrorPublishing();
		const hash = window.location.hash;
		/** @type {{path: string, params: Record<string,string> | {}}} */
		const { params: raw, path } = parseHashRoute(hash);

		const isDev = raw['dev'] === 'true' || raw['dev'] === '1';

		const { entry, params, resolvedPath } = resolveRoute(path, raw);
		routerService.setActiveRouteKey(path);

		const slot = document.getElementById('route-error-slot');
		if (slot) {
			this._routeErrorController?.destroy();
			this._routeErrorController = new ErrorController(slot, {
				mode: 'inline',
				scope: makeRouteScope(resolvedPath),
				store: appStore,
				title: 'Something went wrong'
			});
			this._routeErrorController.init();
		}

		const scope = /** @type {ErrorScope} */ (`route:${path}`);

		if (resolvedPath === NOT_FOUND) {
			pubs.reportNotFound(appStore, scope, {
				userMessage: 'That page does not exist'
			});
		}

		const last = this.currentInstances[this.lastActivePath];
		if (last?.destroy) last.destroy();

		delete this.currentInstances[this.lastActivePath];

		appStore.setState({ route: entry });
		let maybeInstance;
		try {
			maybeInstance = entry.handler(appRoot, resolvedPath, {
				...params,
				dev: isDev
			});
		} catch (error) {
			pubs.reportError(appStore, error, scope);
			return;
		}

		// Ensure all return values are treated as resolves promises.

		Promise.resolve(maybeInstance)
			.then(
				/** @param {ComponentLike} instance */ instance => {
					if (instance && typeof instance.destroy === 'function')
						AppRouter.currentInstances[path] = instance || null;
				}
			)
			.catch(err => {
				pubs.reportError(appStore, err, scope);
			});

		// entry.handler(appRoot, path, { ...params, dev: isDev });
		if (entry.title) {
			document.title = entry.title;
		}

		// Assign new path to last active path for next navigation
		AppRouter.lastActivePath = path;
		// routerService.setActiveRouteKey(path); WAS HERE
	},

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

export function armRetry(appRoot) {
	if (cleanupRetryListener) {
		console.log('[router] retry listener already armed');
		return;
	}
	/** @param {CustomEvent<{scope?: string, data?:any}>} e */
	const onRetrySuccess = e => {
		appStore.setState({ useLive: false });
		console.log('[router] RETRY SUCCESS handler fired', e?.detail);

		// Derive explicit scope
		const { path, params } = parseHashRoute(window.location.hash);

		const preload = e?.detail.data ?? null;

		// const scopeForPath = `${path || '/'}`;
		const scopeForPath = getCurrentRouteScope();
		console.log('Scope required by router: ', scopeForPath);

		if (e.detail?.scope && e.detail?.scope !== scopeForPath) return;

		const entry = routeMap[path];
		if (entry?.handler) {
			if (routeMap[path]?.path !== '/') {
				routeMap[path]?.handler?.(appRoot, path, {
					...params,
					__preload: preload
				});
			}
		}
	};
	window.addEventListener(EVENTS.refetchSuccess, onRetrySuccess);
	cleanupRetryListener = () => {
		window.removeEventListener(EVENTS.refetchSuccess, onRetrySuccess);
		console.log('[router] retry listener installed for', EVENTS.refetchSuccess);
	};
}
