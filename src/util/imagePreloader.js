/**
 * Image preloader to ensure that we dont serve broken images
 *
 *
 */

/**
 * @typedef {{ok: boolean, width?: number, height?:number}} PreloadResult
 */

const cache = new Map();
const hardFailures = new Set();

/**
 * Preloads an image and resolves with {ok, width, height}
 * @param {string} url
 * @param {number} [timeoutMs=7_000]
 * @returns {Promise<PreloadResult>}
 */
export function preloadImage(url, timeoutMs = 7_000) {
	if (!url) return Promise.resolve({ ok: false });
	if (hardFailures.has(url)) return Promise.resolve({ ok: false });
	const existing = cache.get(url);
	if (existing) return existing;

	const promise = new Promise(resolve => {
		const img = new Image();
		let done = false;

		/** @param {boolean} ok */
		const finish = ok => {
			if (done) return;
			done = true;
			img.onload = img.onerror = null;
			resolve(
				ok
					? { height: img.naturalHeight, ok: true, width: img.naturalWidth }
					: { ok: false }
			);
		};
		const t = setTimeout(() => finish(false), timeoutMs);
		img.onload = () => {
			clearTimeout(t);
			finish(true);
		};
		img.onerror = () => {
			clearTimeout(t);
			finish(false);
		};

		// decoding off main thread
		img.decoding = 'async';
		img.src = url;
	});
	cache.set(url, promise);

	// TTL for negatives
	promise.then(res => {
		if (!res.ok) {
			setTimeout(() => cache.delete(url), 60_000);
		}
	});
	return promise;
}

/**
 * Mark URL as permanently failing
 * @param {string} url
 */
export function banImage(url) {
	hardFailures.add(url);
}
