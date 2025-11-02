/**
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/stateTypes.js").ErrorEntry} ErrorEntry
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").StoreAction} StoreAction
 */

import { pushError } from './error.model.js';

/**
 *
 * @param {Error} err
 * @param {Partial<NormalisedError>} [hints]
 * @returns {NormalisedError}
 */
export function normaliseError(err, hints = {}) {
	if (hints.type === 'not_found') {
		return {
			type: 'not_found',
			code: hints.code || 'ROUTE_404',
			userMessage: 'That page doesnt exist.',
			...hints
		};
	}
	if (err && typeof err === 'object' && 'status' in err) {
		const s = /** @type {{status?: number}} */ (err).status ?? 0;
		if (s >= 500)
			return {
				type: 'server',
				code: 'HTTP_5XX',
				status: s,
				userMessage: 'Server error. Please try again.',
				...hints
			};
		if (s === 404) {
			return {
				type: 'not_found',
				code: 'HTTP_404',
				status: s,
				userMessage: "We couldn't find that.",
				...hints
			};
		}
		if (s === 429) {
			return {
				type: 'rate_limit',
				code: 'HTTP_429',
				status: s,
				userMessage: 'Too many requests. Try later',
				...hints
			};
		}
		return {
			type: 'client',
			code: 'HTTP_4XX',
			status: s,
			userMessage: 'There was a problem with your request.',
			...hints
		};
	}
	if (err instanceof TypeError && /fetch/i.test(String(err.message))) {
		return {
			type: 'network',
			code: 'NETWORK',
			userMessage: 'Network issue. Check your connection',
			...hints
		};
	}
	return {
		type: 'unexpected',
		code: 'UNEXPECTED',
		userMessage: 'Unexpected error occurred',
		message: String(err),
		...hints
	};
}

/**
 *
 * @param {NormalisedError} n
 * @param {ErrorScope} [fallback=global]
 * @returns {ErrorEntry}
 */
export function normalisedToEntry(
	n,
	fallback = /** @type {ErrorScope} */ ('global')
) {
	return {
		id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
		type: n.type,
		code: n.code,
		userMessage: n.userMessage,
		status: n.status,
		message: n.message,
		scope: n.context?.scope || fallback,
		severity: 'error',
		sticky: Boolean(n.retry),
		ts: Date.now(),
		meta: n.context || {}
	};
}

/**
 *
 * @param {NormalisedError} n
 * @returns {StoreAction}
 */
export function addError(n) {
	/** @type {StoreAction} */
	return function thunk(ctx) {
		const { setState, getState } = ctx;
		const entry = normalisedToEntry(n);
		const next = pushError(getState().errors || [], entry);
		setState({ errors: next });
	};

	// Optional parameter destructuring syntax,
	// however the above has been included for brevity

	// return ({ setState, getState }) => {
	// 	const entry = normalisedToEntry(n);
	// 	const next = pushError(getState().errors || [], entry);
	// 	setState({ errors: next });
	// };
}

export function publishError(state, normalised) {}
