/**
 * Example hash = #/recipe?id=123
 * @param {string} hash
 * @returns {{ path: string, params: Record<string,string> | {} }}
 */
export function parseHashRoute(hash) {
	const cleanedHash = hash.startsWith('#') ? hash.slice(1) : hash;

	// URL to parse pathname & searchParams
	const url = new URL(cleanedHash, window.location.origin);

	const params = {};

	for (const [key, val] of url.searchParams.entries()) {
		params[key] = val;
	}
	return {
		path: url.pathname,
		params
	};
}
