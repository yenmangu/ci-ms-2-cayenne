/**
 * Example hash = #/recipe?id=123
 * @param {string} hash
 * @returns {{ path: string, params: Record<string,string> | {} }}
 */
export function parseHashRoute(hash) {
	const clean = hash.startsWith('#') ? hash.slice(1) : hash;
	if (!clean) {
		return { params: {}, path: '/' };
	}

	const [rawPath, queryString] = clean.split('?');
	const path = rawPath || '/';

	// URL to parse pathname & searchParams
	const url = new URL(clean, window.location.origin);

	const params = {};

	if (queryString) {
		const searchParams = new URLSearchParams(queryString);
		for (const [key, value] of searchParams.entries()) {
			params[key] = value;
		}
	}

	// Optional "/recipe/786936" style path segments as id param
	const segments = path.split('/').filter(Boolean);
	if (segments.length > 1) {
		return {
			params: { id: segments[1], ...params },
			path: '/' + segments[0]
		};
	}
	return {
		params,
		path
	};
}
