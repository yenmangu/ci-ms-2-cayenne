/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 */

import { reportError, reportRefetch } from './errorReporter.js';
import { getCurrentRouteScope } from './errorScope.js';

let installed = false;
/**
 *
 * @param {AppStore} store
 */
export function installGlobalErrorHooks(store) {
	if (installed) return;
	installed = true;
	// Promise rejections not caught
	window.addEventListener('unhandledrejection', e => {
		const err =
			/** @type {any} */ (e.reason) || new Error('Unhandled Rejection');
		const reported = err && err.__reported === true;

		if (reported) {
			e.preventDefault();
			return;
		}

		const scope = /** @type {ErrorScope}  */ (getCurrentRouteScope());
		/** @type {ErrorMeta} */
		const meta = { endpoint: '', opts: {}, params: {}, url: '' };

		if (err?.name !== 'AbortError' && typeof err?.status !== 'number') {
			reportRefetch(store, scope, meta);
			e.preventDefault();
			return;
		}

		reportError(store, err, { context: { scope } });
		return;
	});

	// Synchronous exceptions that escape the event loop
	window.addEventListener('error', e => {
		const err = e.error || new Error(e.message || 'Window error');
		const scope = /** @type {ErrorScope} */ (getCurrentRouteScope());
		e.preventDefault();
	});
}
