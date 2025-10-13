// devWindow.js

/**
 * A dev-only API hung off the global window during development.
 * Extend this with anything you want to expose in the console.
 * @typedef {Object} DevGlobals
 * @property {() => void} [__stopPaddingProbe]
 * @property {(msg: string, ...args: any[]) => void} [log]
 * @property {Record<string, unknown>} [probes]
 */

/**
 * Window overlay that includes dev globals.
 * @typedef {Window & {
 *   __DEV__?: DevGlobals
 * }} DevWindow
 */

/** @returns {DevWindow} */
export const getDevWindow = () => /** @type {DevWindow} */ (window);

/**  */

/**
 * Ensure window.__DEV__ exists and return it.
 *
 * @param {DevWindow} w
 * @returns {DevGlobals}
 */
export function ensureDev(w) {
	return w.__DEV__ ?? (w.__DEV__ = /** @type {DevGlobals} */ ({}));
}
