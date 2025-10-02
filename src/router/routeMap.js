/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadHome } from '../pages/cayenne.js';
import { handleRecipeDetail } from '../pages/recipe.js';
import { loadRecipes } from '../pages/recipes.js';

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: loadHome,
		title: 'Home',
		domain: true
	},

	'/recipe-grid': {
		handler: loadRecipes
	},

	'/recipe': {
		handler: handleRecipeDetail,
		title: 'Recipe Detail',
		domain: true
	},

	'/404': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
		title: 'Not Found',
		domain: true
	}
};
