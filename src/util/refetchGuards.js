// Endpoint keys from SPOONACULAR_ENDPOINTS
const RANDOM_KEYS = new Set(['getRandomRecipes']);
const DETAIL_KEYS = new Set(['getRecipeInformation', 'summarizeRecipe']);

/**
 * Is 'random recipe' request?
 * @param {string} keyOrPath
 * @returns {boolean}
 */

function isRandomKeyOrPath(keyOrPath) {
	if (RANDOM_KEYS.has(keyOrPath)) return true;

	const str = String(keyOrPath);
	return /\/recipes\/random(?:\/|$)/.test(str);
}

/**
 * Is 'recipe detail' request?
 * @param {string} keyOrPath
 * @returns {boolean}
 */
function isRecipeDetailKeyOrPath(keyOrPath) {
	if (DETAIL_KEYS.has(keyOrPath)) return true;
	const str = String(keyOrPath);
	return /\/recipes\/(?:[^/]+|\{id\}|:id)\/(information|summary)$/.test(str);
}

/**
 * Is this the fallback single-random endpoint?
 * @param {string} path
 */
function isTestRandomPath(path) {
	return /\/recipes\/test-random(?:\/|$)/.test(String(path));
}

/**
 * Is this the fallback collection endpoint?
 * @param {string} path
 */
function isTestCollectionPath(path) {
	return /\/recipes\/test(?:\/|$)/.test(String(path));
}

/**
 * Should we bypass fallback to avoid loops?
 * Convention: when params.refetch === true, we've already attempted a fallback.
 * @param {Record<string, any>} params
 */
function shouldBypassFallback(params = {}) {
	return params?.refetch === true;
}

export {
	isRandomKeyOrPath,
	isRecipeDetailKeyOrPath,
	isTestCollectionPath,
	isTestRandomPath,
	shouldBypassFallback
};
