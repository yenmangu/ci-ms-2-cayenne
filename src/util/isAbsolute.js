/**
 *
 * @param {string} toTest
 * @returns {boolean}
 */
export function isAbsoluteUrl(toTest) {
	return /^https?:\/\//i.test(toTest);
}
