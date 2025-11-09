// /**
//  * @typedef {import("../../types/errorTypes.js").NormalisedError_} NormalisedError
//  * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
//  * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
//  * @typedef {import('../../types/stateTypes.js').ErrorMeta} ErrorMeta
//  */

// import {
// 	addError,
// 	normaliseError,
// 	serialiseError
// } from '../error-component/error.service.js';

// /**
//  *
//  * @param {AppStore} store
//  * @param {unknown} err
//  * @param {Partial<NormalisedError>} hints
//  */
// export function reportError(store, err, hints = {}) {
// 	const details = serialiseError(err);
// 	hints = { ...hints, details };
// 	const n = normaliseError(/** @type {Error} */ (err), hints);
// 	store.dispatch(addError(n));
// 	// throw err;
// }

// /**
//  *
//  * @param {AppStore} store
//  * @param {ErrorScope} scope
//  * @param {ErrorMeta} [meta]
//  */
// export function reportRefetch(
// 	store,
// 	scope,
// 	// { endpoint, opts, params, url } = {}
// 	meta = {}
// ) {
// 	const { endpoint, opts, params, urlAbs: url, status } = meta;
// 	// console.log('meta in reportRefetch: ', meta);

// 	/** @type {NormalisedError} */
// 	const networkError = {
// 		code: 'RETRYABLE',
// 		context: { cmd: 'refetch', endpoint, opts, params, scope, url },
// 		retry: true,
// 		type: 'network',
// 		userMessage:
// 			status === 402
// 				? 'API quota exceeded (402) - retry with test data from Cayenne API'
// 				: 'Network issue. Please try again.'
// 	};
// 	store.dispatch(addError(networkError));
// }

// /**
//  *
//  * @param {AppStore} store
//  * @param {ErrorScope} scope
//  * @param {ErrorMeta[]} metas
//  */
// export function reportRefetchMany(store, scope, metas) {
// 	store.dispatch(
// 		addError({
// 			code: 'RETRYABLE_MANY',
// 			context: { cmd: 'refetchMany', metas, scope },
// 			retry: true,
// 			type: 'network',
// 			userMessage: 'Network issue. Please try again.'
// 		})
// 	);
// }

// /**
//  *
//  * @param {AppStore} store
//  * @param {ErrorScope} scope
//  * @param {{code?: string, userMessage?: string}} [opts]
//  */
// export function reportNotFound(store, scope, opts = {}) {
// 	const { code = 'ROUTE_404', userMessage = "That page doesn't exist." } = opts;
// 	store.dispatch(
// 		addError({
// 			code,
// 			context: { scope },
// 			type: 'not_found',
// 			userMessage
// 		})
// 	);
// }
