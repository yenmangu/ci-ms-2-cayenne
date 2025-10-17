/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadHome } from '../pages/cayenne.js';
import { loadRecipeDetail } from '../pages/recipe.js';
import { loadRecipes, recipes } from '../pages/recipes.js';
import { loadShoppingList } from '../pages/shoppingList.js';

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		handler: loadHome,
		path: '/',
		title: 'Home',
		domain: true,
		showInNav: true,
		icon: 'house'
	},

	'/recipe-grid': {
		handler: recipes,
		path: '/recipe-grid',
		title: 'Recipe Results'
	},

	'/recipe': {
		handler: loadRecipeDetail,
		path: '/recipe',
		title: 'Recipe Detail',
		domain: true
	},

	'/shopping-list': {
		handler: loadShoppingList,
		path: '/shopping-list',
		title: 'Shopping List',
		domain: true,
		showInNav: true,
		icon: 'basket-shopping'
	},

	'/404': {
		handler: (appRoot, pathName, params) => {
			console.log('Route handler triggered with: ', pathName);
		},
		path: '/404',
		title: 'Not Found',
		domain: true
	}
};
