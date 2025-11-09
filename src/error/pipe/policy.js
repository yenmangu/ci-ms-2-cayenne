/**
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/errorTypes.js").Decision} Decision
 */

/**
 *
 * @param {NormalisedError} n
 * @returns {Decision}
 */
export function applyErrorPolicy(n) {
	const meta = n.context || {};
	// Most important first (402)
	if (n.status === 402) {
		return { kind: 'show', payload: n };
	}

	if (n.status === 404 || n.type === 'not_found') {
		return { kind: 'show', payload: n };
	}

	if (n.status === 429) {
		return { kind: 'retry', meta };
	}

	if (n.status && n.status >= 500) {
		return { kind: 'retry', meta };
	}

	if (n.type === 'server') {
		return { kind: 'retry', meta };
	}

	if (n.type === 'network' && n.retry) {
		return { kind: 'retry', meta };
	}

	return { kind: 'show', payload: n };
}
