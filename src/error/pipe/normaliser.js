/**
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").Severity} Severity
 */

import { extractMeta } from '../util/extractMeta.js';

// normaliseError(): ordering contract
// 1) explicit hints (e.g. type === 'not_found')
// 2) HTTP status branches (>=500, 404, 429, 402, 304, generic 4xx)
// 3) CONNECTION_REFUSED (no status; err or hints.cause token)
// 4) retry hint → RETRYABLE (no status)
// 5) fetch TypeError → NETWORK
// 6) AbortError → ABORTED
// 7) fallback → UNEXPECTED

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

	if (isConnectionRefused(err) || isConnectionRefused(hints)) {
		const detected = {
			code: 'CONNECTION_REFUSED',
			type: 'network',
			userMessage: "Can't reach the server right now. Please try again.",
			retry: true
		};
		return mergePreservingCore(detected, hints);
	}

	// Existing generic fetch/TypeError fallback
	if (err instanceof TypeError && /fetch/i.test(String(err.message))) {
		const detected = {
			code: 'NETWORK',
			type: 'network',
			userMessage: 'Network issue. Please try again.',
			retry: true
		};
		return mergePreservingCore(detected, hints);
	}

	// Existing AbortError branch (tiny copy fix)
	if (err && typeof err === 'object' && 'name' in /** @type {any} */ (err)) {
		const name = /** @type {{name?: string}} */ (err).name;
		if (name === 'AbortError') {
			const detected = {
				code: 'ABORTED',
				type: 'network',
				userMessage: 'Request cancelled or timed out.',
				retry: true
			};
			return mergePreservingCore(detected, hints);
		}
	}

	if (
		isConnectionRefused(err) ||
		isConnectionRefused(hints?.cause) ||
		hints?.reason === 'connection_refused'
	) {
		const detected = {
			code: 'CONNECTION_REFUSED',
			type: 'network',
			userMessage: "Can't reach the server right now. Please try again.",
			retry: true
		};
		return mergePreservingCore(detected, hints);
	}
	if (hints && hints.retry === true) {
		return {
			code: 'RETRYABLE',
			type: 'network',
			userMessage: hints.userMessage || 'Network issue. Please try again.',
			retry: true,
			...hints
		};
	}

	// fallback
	return mergePreservingCore(
		{
			code: 'UNEXPECTED',
			type: 'unexpected',
			userMessage: 'Unexpected error occurred.',
			message: String(err),
			...hints
		},
		hints
	);
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

/**
 * Merge `hints` into `base` without overwriting core fields
 * (code, type, status, userMessage) unless `opts.force === true`.
 *
 * @template {{ [k: string]: unknown }} T
 * @param {T} base
 * @param {Partial<T>|undefined} hints
 * @param {{ force?: boolean, protectedKeys?: ReadonlyArray<keyof T> }} [opts]
 * @returns {T}
 */
export function mergePreservingCore(base, hints, opts) {
	if (!hints) return base;

	/** @type {T} */
	const out = { ...base };
	const force = !!(opts && opts.force);

	/** @type {ReadonlyArray<keyof T>} */
	const protectedKeys =
		(opts && opts.protectedKeys) ??
		/** @type {any} */ (['code', 'type', 'status', 'userMessage']);

	const protectedSet = new Set(protectedKeys);

	for (const /** @type {keyof T} */ k of /** @type {any} */ (
		Object.keys(hints)
	)) {
		const v = /** @type {any} */ (hints)[k];
		if (v === undefined) continue;
		if (!force && protectedSet.has(k)) continue;
		/** @type {any} */ (out)[k] = v;
	}
	return out;
}

/**
 * Loosely detect a "connection refused" signal across runtimes.
 * Checks err.{code|name|message} and err.cause.{code|name|message}.
 *
 * @param {unknown} unknownError
 * @returns {boolean}
 */
function isConnectionRefused(unknownError) {
	if (!unknownError || typeof unknownError !== 'object') return false;

	/** @type {{ code?: unknown, name?: unknown, message?: unknown, cause?: unknown }} */
	const err = unknownError;

	const tokens = [
		'ECONNREFUSED',
		'ERR_CONNECTION_REFUSED',
		'net::ERR_CONNECTION_REFUSED'
	];

	const containsToken = value => {
		if (!value) return false;
		const text = String(value).toUpperCase();
		return tokens.some(t => text.includes(t.toUpperCase()));
	};

	if (
		containsToken(err.code) ||
		containsToken(err.name) ||
		containsToken(err.message)
	) {
		return true;
	}

	if (err.cause && typeof err.cause === 'object') {
		/** @type {{ code?: unknown, name?: unknown, message?: unknown }} */
		const cause = err.cause;
		if (
			containsToken(cause.code) ||
			containsToken(cause.name) ||
			containsToken(cause.message)
		) {
			return true;
		}
	}

	return false;
}
