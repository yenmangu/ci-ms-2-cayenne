/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadHome } from '../pages/cayenne.js';

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: loadHome,
		title: 'Home'
	},
	'/recipe': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
		title: 'Recipe Detail'
	},
	'/404': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
		title: 'Not Found'
	}
};
