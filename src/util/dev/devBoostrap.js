import { emulateViewportFromQuery } from './forceView.js';
import { getUnifiedParams } from './unifiedParams.js';

/**
 * Small function to determine if ?dev=true/1/<*> is passed
 *
 * @returns {boolean}
 */
function getDev() {
	const { page, hash, get, getAllObject } = getAllParams();

	const string = window.location.search;
	const params = new URLSearchParams(string);
	const dev = (params.get('dev') || '').toLowerCase();

	return dev !== null ? true : false;
}

/**
 *
 * @param {object} [options]
 * @param {boolean} [options.forceView]
 *
 * @returns
 */
export function initDevBootstrap(options = {}) {
	if (!getDev()) return;
	// console.log('dev');

	if (options.forceView) {
		const params = getUnifiedParams();
		emulateViewportFromQuery(params);
	}
}

function getAllParams() {
	const page = new URLSearchParams(window.location.search);
	const hash = (() => {
		const [n = '', q = ''] = (window.location.hash || '').split('?');
		return new URLSearchParams(q);
	})();
	return {
		page,
		hash,
		getObject(name) {
			return {
				[name]: hash.get(name) ?? page.get(name)
			};
		},
		getAllObject(name) {
			return {
				[name]: [hash.getAll(name), ...page.getAll(name)]
			};
		},
		get(name) {
			return hash.get(name) ?? page.get(name);
		},
		getAll(name) {
			return [...hash.getAll(name), ...page.getAll(name)];
		}
	};
}
