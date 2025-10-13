//@ts-check

import { ensureDev, getDevWindow } from './devWindow.js';

/**
 * @typedef {() => void} StopProbe
 * A function that stops the padding/transform probe: cancels the rAF loop,
 * removes transition listeners, and clears any console logging.
 */

/**
 * Start a diagnostic probe that logs changes to an element's `padding-top` and
 * `transform` properties on every animation frame, and reports
 * `transitionstart` / `transitionend` events for those properties.
 *
 * - Sampling is performed via `requestAnimationFrame`, so logs align with paint frames.
 * - Useful for verifying whether `padding-top` is transitioning (or snapping) during
 *   layout/animation sequences.
 * - Side effect: exposes `window.__stopPaddingProbe` for manual stop from DevTools.
 *
 * @param {HTMLElement} el
 *        The element to probe (e.g., `document.querySelector('main#cayenne-main')`).
 * @param {string} [label='main#cayenne-main']
 *        Optional label to identify the probed element in logs (not required).
 * @returns {StopProbe}
 *        A function you can call to stop the probe and remove all listeners.
 *
 * @example
 * // In DevTools:
 * const stop = startPaddingProbe(document.querySelector('main#cayenne-main'));
 * // ...trigger your animation...
 * stop(); // or call window.__stopPaddingProbe()
 */
export function startPaddingProbe(el, label = 'main#cayenne-main') {
	if (!el) {
		console.warn('[probe] missing element');
		return () => {};
	}

	const read = () => {
		const cs = getComputedStyle(el);
		return { paddingTop: cs.paddingTop, transform: cs.transform };
	};

	const t0 = performance.now();
	let last = read();
	let raf = 0;
	let running = true;

	/**
	 *
	 * @param {number} ts
	 */
	const tick = ts => {
		const cur = read();
		if (
			cur.paddingTop !== last.paddingTop ||
			cur.transform !== last.transform
		) {
			const ms = (ts - t0).toFixed(2);
			console.log(
				`[${ms}ms] (${label}) padding-top: ${last.paddingTop} → ${cur.paddingTop}; ` +
					`transform: ${last.transform} → ${cur.transform}`
			);
			last = cur;
		}
		if (running) raf = requestAnimationFrame(tick);
	};

	/**
	 *
	 * @param {TransitionEvent} e
	 */
	const onT = e => {
		if (e.propertyName === 'padding-top' || e.propertyName === 'transform') {
			const ms = (performance.now() - t0).toFixed(2);
			console.log(`[${ms}ms] (${label}) ${e.type} → ${e.propertyName}`);
		}
	};

	el.addEventListener('transitionstart', onT);
	el.addEventListener('transitionend', onT);

	raf = requestAnimationFrame(tick);

	const stop = () => {
		if (!running) return;
		running = false;
		cancelAnimationFrame(raf);
		el.removeEventListener('transitionstart', onT);
		el.removeEventListener('transitionend', onT);
		console.log(`[probe] (${label}) stopped`);
	};

	// Expose for manual stop in console if needed
	const w = getDevWindow();
	const dev = ensureDev(w);

	dev.__stopPaddingProbe = stop;

	return stop;
}
