/**
 *
 * @param {WeakSet<object>} [seen]
 * @returns
 */
export function createDeduper(seen = new WeakSet()) {
	/**
	 *
	 * @param {unknown} key
	 * @returns {boolean}
	 */
	function once(key) {
		if (key && typeof key === 'object') {
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		}
		return true;
	}
	return { once, seen };
}
