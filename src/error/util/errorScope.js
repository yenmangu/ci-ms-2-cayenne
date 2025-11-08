/**
 * @typedef {import("../../types/errorTypes.js").ErrorScope} ErrorScope
 */

/**
 *
 * @param {string} name
 */
export function makeRouteScope(name) {
	return /** @type {`route:${string}`} */ (`route:${name}`);
}
/**
 *
 * @param {string} name
 */
export function makeSectionScope(name) {
	return /** @type {`route:${string}`} */ (`section:${name}`);
}

export function getCurrentRouteScope() {
	const hash = (globalThis.location?.hash || '').replace(/^#/, '');
	const path = hash.split('?')[0] || '/';
	return makeRouteScope(path);
}
