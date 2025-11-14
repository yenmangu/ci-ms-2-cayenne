/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 */

/**
 * Note: console statements and groups left intentionally
 */

import { createErrorPublishing } from '../pipe/publishFactory.js';
import { getCurrentRouteScope } from './errorScope.js';

let installed = false;

/**
 *
 * @param {AppStore} store
 */
export function installGlobalErrorHooks(store) {
	const devMode = store.getState().devMode ?? false;
	if (installed) return;
	installed = true;
	const pubs = createErrorPublishing();
	/** @param {any} ev */
	function onUnhandledRejection(ev) {
		// console.warn('unhandledrejection: ', ev);

		const scope = getCurrentRouteScope();

		if (devMode) {
			// debug-only breadcrumb
			// console.groupCollapsed('[unhandledrejection]');
			// console.log('reason:', ev?.reason);
			// console.groupEnd();
		}
		pubs.routeError(store, scope, ev?.reason, {
			cmd: 'reloadRoute'
		});
	}

	/** @param {ErrorEvent} ev */
	function onWindowError(ev) {
		// console.warn('dev reading in global hooks: ', devMode);
		// console.warn('windowerror: ', ev);

		const scope = getCurrentRouteScope();

		if (store.getState().devMode) {
			// console.groupCollapsed('[window.error]');
			// console.log('error:', ev?.error ?? ev?.message);
			// console.groupEnd();
		}
		const err =
			ev?.error instanceof Error ? ev.error : new Error(String(ev?.message));
		pubs.routeError(store, scope, err, { cmd: 'reloadRoute' });
	}

	window.addEventListener('unhandledrejection', onUnhandledRejection);
	window.addEventListener('error', onWindowError);

	return () => {
		window.removeEventListener('unhandledrejection', onUnhandledRejection);
		window.removeEventListener('error', onWindowError);
		installed = false;
	};
}
