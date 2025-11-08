/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").ErrorContext} ErrorContext
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/errorTypes.js").ErrorType} ErrorType
 */

import { HttpError } from '../errors/httpError.js';
import { reportRefetch } from '../util/errorReporter.js';

/**
 * @param {AppStore} store
 */
export function switchToTestOnce(store) {
	const { useLive } = store.getState();
	if (useLive) store.setState({ useLive: false });
}

/**
 *
 * @param {AppStore} store
 * @param {ErrorScope} scope
 * @param {ErrorMeta} meta
 */
export function handleQuotaExceed(store, scope, meta) {
	// console.log('meta in handleQuotaExceed: ', meta);

	switchToTestOnce(store);
	reportRefetch(store, scope, {
		...meta,
		params: { ...(meta.params || {}), refetch: true, useCache: true }
	});

	const err = new HttpError(
		'API quota exceeded (402) - switched to test data from proxy API'
	);
	/** @type {any} */ (err).__reported = true;
	/** @type {any} */ (err).status = 402;

	throw err;
}
