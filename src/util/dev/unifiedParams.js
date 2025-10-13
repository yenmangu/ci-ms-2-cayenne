/**
 * Unified query reader for SPA + static pages.
 * - Reads page query (?a=b before #)
 * - Reads hash query (…#/path?x=y after #)
 * - Hash params take precedence over page params.
 */
export function getUnifiedParams() {
	const page = new URLSearchParams(window.location.search);

	const hashStr = window.location.hash || '';
	// Extract the part after the first '?', if any.
	const [, hashQuery = ''] = hashStr.split('?');
	const hash = new URLSearchParams(hashQuery);

	return {
		/** Prefer hash value when present (returns string or null) */
		get(name) {
			return hash.get(name) ?? page.get(name);
		},
		/** Get all values across both (hash first) */
		getAll(name) {
			return [...hash.getAll(name), ...page.getAll(name)];
		},
		/** Convenience: test truthy flag like ?mobile=1 or &mobile */
		hasTruthyFlag(name) {
			if (hash.has(name)) {
				const v = hash.get(name);
				return v === '' || v === '1' || v?.toLowerCase() === 'true';
			}
			if (page.has(name)) {
				const v = page.get(name);
				return v === '' || v === '1' || v?.toLowerCase() === 'true';
			}
			return false;
		}
	};
}
