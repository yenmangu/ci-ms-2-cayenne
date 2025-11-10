/**
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").Severity} Severity
 */

import { extractMeta } from '../util/extractMeta.js';

/**
 *
 * @param {unknown} err
 * @param {Partial<NormalisedError>} hints
 * @returns {NormalisedError}
 */
export function normaliseError(err, hints = {}) {
	// Honour these explicit hints first

	if (hints.type === 'not_found') {
		return {
			code: hints.code || 'ROUTE_404',
			type: 'not_found',
			userMessage: 'That resource does not exist',
			...hints
		};
	}

	if (err && typeof err === 'object' && 'status' in err) {
		const s = /** @type {{status?: number}} */ (err).status;

		if (s >= 500) {
			return {
				code: 'HTTP_5XX',
				status: s,
				type: 'server',
				userMessage: 'Server error. Please try again.',
				...hints
			};
		}
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
				type: 'network',
				userMessage: 'Too many requests. Try later.',
				retry: true,
				...hints
			};
		}
		if (s === 402) {
			return {
				code: 'HTTP_402',
				status: s,
				type: 'network',
				userMessage: `Quota exceeded for alive API usage. <strong>Retry</strong> to switch to server-cached data.
				See <a class="error-link"
					style="color: var(--cayenne-colour-red-dark)"
					href="../../../how-to-use.html">How to use</a> for more information.`,
				retry: true,
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
			retry: true,
			...hints
		};
	}

	if (err && typeof err === 'object' && 'name' in err) {
		const name = /** @type {{name:? string}} */ (err).name;
		if (name === 'AbortError') {
			return {
				code: 'ABORTED',
				type: 'network',
				userMessage: 'Request cancelled of timed out',
				retry: true,
				...hints
			};
		}
	}

	// fallback
	return {
		code: 'UNEXPECTED',
		type: 'unexpected',
		userMessage: 'Unexpected error occurred.',
		message: String(err),
		...hints
	};
}

/**
 *
 * @param {NormalisedError} n
 * @param {ErrorScope} scope
 */
export function normalisedToEntry(n, scope) {
	const meta = extractMeta(n);
	return {
		code: n.code,
		id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
		message: n.message,
		meta: n.context || {},
		scope: scope,
		severity: /** @type {Severity} */ ('error'),
		status: n.status,
		sticky: Boolean(n.retry),
		ts: Date.now(),
		type: n.type,
		userMessage: n.userMessage,
		details: n.details ? n.details : undefined
	};
}
