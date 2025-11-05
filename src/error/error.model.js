/**
 * @typedef {import("../types/stateTypes.js").ErrorEntry} ErrorEntry
 * @typedef {import("../types/stateTypes.js").ErrorScope} ErrorScope
 */

/**
 * @typedef {object} GCOptions
 * @property {number} [ttl=300000]
 * @property {number} [max=50]
 */

/** @type {number} */
const DEDUPE_TTL = 60_000;

/** @type {Map<string, number>} */
const dedupeMap = new Map();

/**
 * Build stable, serialisable dedupe key from an error entry.
 * Uses a slim projection of 'meta' to avoid collisions
 *
 * @param {ErrorEntry} e
 * @returns {string}
 */
function makeDedupeKey(e) {
	const m = e.meta ?? {};
	const slim = { cmd: m.cmd, endpoint: m.endpoint ?? m.url };
	return JSON.stringify({
		code: e.code,
		meta: slim,
		scope: e.scope,
		status: e.status ?? null
	});
}

/**
 *
 * @param {number} [now=Date.now()]
 * @returns {void}
 */
function dedupePrune(now = Date.now()) {
	for (const [k, exp] of dedupeMap) {
		if (exp <= now) dedupeMap.delete(k);
	}
}

/**
 *
 * @param {ErrorEntry} e
 * @param {number} [now=Date.now()]
 * @returns {boolean}
 */
function dedupeAccept(e, now = Date.now()) {
	dedupePrune(now);
	const key = makeDedupeKey(e);
	if (dedupeMap.has(key)) return false;
	dedupeMap.set(key, now + DEDUPE_TTL);
	return true;
}

/**
 *
 * @param {ErrorEntry[]} list - current error list (may be empty)
 * @param {ErrorEntry} entry - entry to add to list
 * @returns {ErrorEntry[]} - New list with entry appended if accepted; else original list
 *
 * @example
 * const next = pushError(state.errors || [], entry);
 * setState({ errors: next });
 */
export function pushError(list, entry) {
	if (!dedupeAccept(entry)) return list;
	return [...list, entry];
}

/**
 *
 * @param {ErrorEntry[]} list
 * @param {string} id
 * @returns {ErrorEntry[]}
 *
 * @example
 * setState({ errors: resolveError(state.errors || [], id) });
 */
export function resolveError(list, id) {
	return list.filter(e => e.id !== id);
}

/**
 *
 * @param {ErrorEntry[]} list
 * @param {ErrorScope} scope
 * @returns {ErrorEntry[]}
 *
 * @example setState({ errors: clearScope(state.errors || [], 'section:recipe-grid') });
 */
export function clearScope(list, scope) {
	return list.filter(e => e.scope !== scope);
}

/**
 *
 * @param {ErrorEntry[]} list
 * @param {ErrorScope} scope
 * @returns {ErrorEntry|null}
 *
 * @example
 * const latest = selectLatest(state.errors || [], 'route:/recipes');
 */
export function selectLatest(list, scope) {
	const a = list.filter(e => e.scope === scope);
	return a[a.length - 1] || null;
}
/**
 *
 * @param {ErrorEntry[]} list
 * @param {GCOptions} [options]
 * @returns {ErrorEntry[]}
 *
 * @example
 * setState({ errors: garbageCollectErrors(state.errors || [], {ttl:300000, max: 50 }) });
 */
export function garbageCollectErrors(
	list,
	{ max = 50, ttl = 5 * 60_000 } = {}
) {
	const now = Date.now();
	let pruned = list.filter(e => now - e.ts < ttl);
	if (pruned.length > max) {
		pruned = pruned.slice(-max);
	}
	return pruned;
}
