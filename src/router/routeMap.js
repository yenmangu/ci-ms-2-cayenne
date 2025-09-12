/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
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
