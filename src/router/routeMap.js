/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadHome } from '../pages/cayenne.js';
import { loadRecipeDetail } from '../pages/recipe.js';
import { loadRecipes } from '../pages/recipes.js';
import { loadShoppingList } from '../pages/shoppingList.js';

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: loadHome,
		title: 'Home',
		domain: true,
		showInNav: true,
		icon: 'house'
	},

	'/recipe-grid': {
		handler: loadRecipes,
		title: 'Recipe Results'
	},

	'/recipe': {
		handler: loadRecipeDetail,
		title: 'Recipe Detail',
		domain: true
	},

	'/shopping-list': {
		handler: loadShoppingList,
		title: 'Shopping List',
		domain: true,
		showInNav: true,
		icon: 'basket-shopping'
	},

	'/404': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
		title: 'Not Found',
		domain: true
	}
};
