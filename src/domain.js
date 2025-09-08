/**
 * @typedef {import("./types/uiTypes.js").LinkObject} Link
 */

/**
 *
 * @param {Link[]} links
 * @returns {string | null}
 */
export function getActivePageLink(links) {
	const pathname = window.location.pathname;
	const currentPath = pathname.slice(pathname.lastIndexOf('/'));

	for (const link of links) {
		const linkPath = link.href.slice(link.href.lastIndexOf('/'));
		if (linkPath === currentPath) {
			return link.title;
		}
	}
	return null;
}
