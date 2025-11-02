/**
 * @typedef {import("../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../types/stateTypes.js").AppStore} AppStore
 * @typedef {import('../types/stateTypes.js').ErrorMeta} ErrorMeta
 */

import { normaliseError, addError } from '../components/error/error.service.js';

/**
 *
 * @param {AppStore} store
 * @param {unknown} err
 * @param {Partial<NormalisedError>} hints
 */
export function reportError(store, err, hints = {}) {
	const n = normaliseError(/** @type {Error} */ (err), hints);
	store.dispatch(addError(n));
}

/**
 *
 * @param {AppStore} store
 * @param {ErrorScope} scope
 * @param {ErrorMeta} [meta]
 */
export function reportRefetch(
	store,
	scope,
	{ url, endpoint, params, opts } = {}
) {
	/** @type {NormalisedError} */
	const networkError = {
		type: 'network',
		code: 'RETRYABLE',
		userMessage: 'Network issue. Please try again.',
		retry: true,
		context: { scope, cmd: 'refetch', url, endpoint, params, opts }
	};
	store.dispatch(addError(networkError));
}

/**
 *
 * @param {AppStore} store
 * @param {ErrorScope} scope
 * @param {{code?: string, userMessage?: string}} [opts]
 */
export function reportNotFound(store, scope, opts = {}) {
	const { code = 'ROUTE_404', userMessage = "That page doesn't exist." } = opts;
	store.dispatch(
		addError({
			type: 'not_found',
			code,
			userMessage,
			context: { scope }
		})
	);
}
