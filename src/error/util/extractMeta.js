/**
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/errorTypes.js").ErrorMeta} ErrorMeta
 */

/**
 *
 * @param {NormalisedError} n
 * @returns {ErrorMeta}
 */
export function extractMeta(n) {
	const ctx = n && n.context && typeof n.context === 'object' ? n.context : {};
	return {
		endpoint: ctx.endpoint,
		opts: ctx.opts,
		params: ctx.params,
		urlAbs: ctx.urlAbs,
		status: typeof n.status === 'number' ? n.status : ctx.status
	};
}

/**
 *
 * @param {NormalisedError} n
 * @returns {ErrorMeta[] | undefined}
 */
export function toErrorMetas(n) {
	const ctx =
		n && n.context && typeof n.context === 'object'
			? /** @type {Record<string, unknown>} */ (n.context)
			: {};
	const metas = /** @type {ErrorMeta[] | undefined} */ (ctx.metas);
	return Array.isArray(metas) ? metas : undefined;
}
