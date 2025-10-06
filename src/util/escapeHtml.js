/**
 * Escape a string for safe insertion into HTML
 *
 * @param {string} unsafe
 * @returns {string}
 */
export function escapeHtml(unsafe) {
	return String(unsafe)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
