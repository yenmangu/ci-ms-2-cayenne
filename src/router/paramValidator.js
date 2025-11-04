/**
 * @typedef {import("../types/routerTypes.js").NormalisedParams} NormalisedParams
 */

/**
 *
 * @param {Record<string, any>} params
 * @param {string} key
 */
export function hasNonEmpty(params, key) {
	const v = params?.[key];
	if (Array.isArray(v)) {
		return v.some(s => String(s).trim().length > 0);
	}
	return typeof v === 'string' ? v.trim().length > 0 : v != null;
}

/**
 *
 * @param {Record<string, any>} params
 * @param {string[]} keys
 * @returns
 */
export function hasAnyNonEmpty(params, keys) {
	return keys.some(k => hasNonEmpty(params, k));
}

export function isPositiveInteger(value) {
	const re = /^\d+$/;
	return re.test(String(value));
}

/**
 *
 * @param {Record<string, any>} raw
 * @returns {NormalisedParams}
 */
export function normaliseParams(raw) {
	const p = { ...raw };

	if (typeof p.search === 'string') {
		const s = /** @type {string} */ (p.search);
		p.search = s
			.split(',')
			.map(s => s.trim())
			.filter(Boolean);
	} else if (Array.isArray(p.search)) {
		p.search = p.search
			.map(/** @param {string} str */ str => String(str).trim())
			.filter(Boolean);
	}
	return p;
}
