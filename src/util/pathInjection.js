/**
 * Returns true if the path still contains an ID token.
 * Supports :id and {id}.
 * @param {string} path
 */
function pathNeedsId(path) {
	return /:id|\{id\}/.test(path);
}

/**
 * Replaces a single ID token in the path with the provided id.
 * Supports /.../:id/... and /.../{id}/....
 * Does not mutate input.
 * @param {string} path
 * @param {number|string} id
 * @returns {string}
 */
function injectIdIntoPath(path, id) {
	const idStr = String(id);
	return (
		path
			.replace(/\{id\}/, idStr)
			.replace(/:id\b/, idStr)
			// Also handle the common “/:id/” segment shape to preserve slashes cleanly
			.replace(/\/:id(\/|$)/, `/${idStr}$1`)
	);
}

/**
 * Convenience that injects id if present; otherwise returns path unchanged.
 * @param {string} path
 * @param {Record<string, any>} params
 */
function buildIdPath(path, params) {
	if (params?.id == null) return path;
	return injectIdIntoPath(path, params.id);
}

export { buildIdPath, injectIdIntoPath, pathNeedsId };
