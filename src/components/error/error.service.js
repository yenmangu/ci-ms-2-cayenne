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
			code: hints.code || 'ROUTE_404',
			type: 'not_found',
			userMessage: 'That page doesnt exist.',
			...hints
		};
	}
	if (err && typeof err === 'object' && 'status' in err) {
		const s = /** @type {{status?: number}} */ (err).status ?? 0;
		if (s >= 500)
			return {
				code: 'HTTP_5XX',
				status: s,
				type: 'server',
				userMessage: 'Server error. Please try again.',
				...hints
			};
		if (s === 404) {
			return {
				code: 'HTTP_404',
				status: s,
				type: 'not_found',
				userMessage: "We couldn't find that.",
				...hints
			};
		}
		if (s === 429) {
			return {
				code: 'HTTP_429',
				status: s,
				type: 'rate_limit',
				userMessage: 'Too many requests. Try later',
				...hints
			};
		}
		return {
			code: 'HTTP_4XX',
			status: s,
			type: 'client',
			userMessage: 'There was a problem with your request.',
			...hints
		};
	}
	if (err instanceof TypeError && /fetch/i.test(String(err.message))) {
		return {
			code: 'NETWORK',
			type: 'network',
			userMessage: 'Network issue. Check your connection',
			...hints
		};
	}
	return {
		code: 'UNEXPECTED',
		message: String(err),
		type: 'unexpected',
		userMessage: 'Unexpected error occurred',
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
		code: n.code,
		id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
		message: n.message,
		meta: n.context || {},
		scope: n.context?.scope || fallback,
		severity: 'error',
		status: n.status,
		sticky: Boolean(n.retry),
		ts: Date.now(),
		type: n.type,
		userMessage: n.userMessage
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
		const { getState, setState } = ctx;
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
