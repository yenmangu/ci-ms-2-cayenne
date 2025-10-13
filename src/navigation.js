/**
 * @typedef {import("./types/uiTypes.js").LinkObject} Link
 */

/**
 *
 * @param {Link[]} links
 * @returns {string | null}
 */
export function getActivePageLink(links) {
	let pathname = window.location.pathname;
	console.log('widnow.location: ', window.location.host);

	// Normalise root to index.html for local dev and GitHub Pages
	if (pathname == '/' || pathname === '') {
		pathname = '/index.html';
	}
	const currentPath = pathname.slice(pathname.lastIndexOf('/'));

	for (const link of links) {
		const linkPath = link.href.slice(link.href.lastIndexOf('/'));
		if (linkPath === currentPath) {
			return link.title;
		}
	}
	return null;
}

/**
 *
 * @param {Link[]} links
 * @returns {string|null}
 */
export function resolveActiveTitleFromBody(links) {
	const page = document.body.getAttribute('data-page');
	if (!page) return null;

	const match = links.find(l => l.dataPage === page);
	return match ? match.title : null;
}
