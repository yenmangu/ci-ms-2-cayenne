/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: () => {},
		title: 'Home'
	},
	'/recipe': {
		handler: () => {},
		title: 'Recipe Detail'
	},
	'/404': {
		handler: () => {},
		title: 'Not Found'
	}
};
