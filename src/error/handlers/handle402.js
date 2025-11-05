/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").ErrorContext} ErrorContext
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/errorTypes.js").ErrorType} ErrorType
 */

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
	switchToTestOnce(store);
	reportRefetch(store, scope, meta);

	const err = new Error(
		'API quota exceeded (404) - switched to test data from proxy API'
	);
	/** @type {any} */ (err).__reported = true;

	throw err;
}
