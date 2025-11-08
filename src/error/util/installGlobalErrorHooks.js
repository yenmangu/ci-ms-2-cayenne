/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 */

import { reportError, reportRefetch } from './errorReporter.js';
import { getCurrentRouteScope } from './errorScope.js';

const __reportedSet = new WeakSet();
let installed = false;

/**
 *
 * @param {unknown} err
 */
function markReported(err) {
	if (!err || (typeof err !== 'object' && typeof err !== 'function')) return;
	try {
		Object.defineProperty(err, '__reported', {
			value: true,
			enumerable: false,
			configurable: true,
			writable: true
		});
	} catch {
		try {
			// @ts-ignore
			err.__reported = true;
		} catch {
			__reportedSet.add(err);
		}
	}
	if (err && typeof err === 'object') {
		// @ts-ignore
		err.__reported = true;
	}
}

export function isReported(err) {
	try {
		if (err && err.__reported === true) return;
	} catch (error) {
		return !!(err && typeof err === 'object' && __reportedSet.has(err));
	}
}

/**
 *
 * @param {AppStore} store
 */
export function installGlobalErrorHooks(store) {
	if (installed) return;
	installed = true;
	// Promise rejections not caught
	window.addEventListener('unhandledrejection', e => {
		if (e.reason) {
		}
		const err =
			/**
			 * @type {{
			 * meta?: ErrorMeta,
			 * status?: number
			 * } & Record<string, unknown> | any}
			 * */ (e.reason) || new Error('Unhandled Rejection');

		if (isReported(err)) {
			e.preventDefault();
			return;
		}

		const scope = /** @type {ErrorScope}  */ (getCurrentRouteScope());

		if (typeof err?.status === 'number') {
			markReported(err);
			e.preventDefault();
			return;
		}

		if (err?.name === 'AbortError') {
			markReported(err);
			e.preventDefault();
			return;
		}

		/** @type {ErrorMeta} */
		const meta = err?.meta;
		const hasActionableMeta = meta && (meta.urlAbs || meta.endpoint);
		if (hasActionableMeta) {
			markReported(err);

			// Preserve provided params e.g., useCache:true for 402 flows
			reportRefetch(store, scope, {
				...meta,
				params: { ...(meta.params || {}) }
			});
			e.preventDefault();
			return;
		}
		// // Otherwise unknown rejection with no meta -> normalise to generic error
		// markReported(err);
		// reportError(store, err, { context: { scope } });
		// e.preventDefault();

		// if (err?.name !== 'AbortError' && typeof err?.status !== 'number') {
		// 	reportRefetch(store, scope, meta);
		// 	e.preventDefault();
		// 	return;
		// }

		// if (typeof err?.status === 'number') {
		// 	markReported(err);
		// 	reportError(store, err, { context: { scope } });
		// 	e.preventDefault();
		// 	return;
		// }

		markReported(err);
		reportError(store, scope, meta);
		// e.preventDefault();
	});

	// Synchronous exceptions that escape the event loop
	window.addEventListener('error', e => {
		const err = e.error || new Error(e.message || 'Window error');
		const reported = err && err.__reported === true;
		if (reported) {
			e.preventDefault();
			return;
		}
		const scope = /** @type {ErrorScope} */ (getCurrentRouteScope());
		// If surfaced as HttpError synchronously, its already handled
		if (typeof err?.status === 'number') {
			markReported(err);
			e.preventDefault();
			return;
		}

		markReported(err);
		reportError(store, err, { context: { scope } });
		// e.preventDefault();
		// console.log(err);
	});
}
