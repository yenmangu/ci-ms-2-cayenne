/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadNotFoundPage } from '../pages/404.js';
import { loadHome } from '../pages/cayenne.js';
import { loadLikedRecipes } from '../pages/likedRecipes.js';
import { loadRecipeDetail } from '../pages/recipe.js';
import { loadRecipes, recipes } from '../pages/recipes.js';
import { loadShoppingList } from '../pages/shoppingList.js';

export const NOT_FOUND = '/not-found';

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

	'/saved-recipes': {
		handler: loadLikedRecipes,
		path: '/saved-recipes',
		title: 'Saved Recipes',
		domain: true,
		showInNav: true,
		useOwnIcon: true,
		icon: 'wishlist.svg'
	},

	NOT_FOUND: {
		handler: loadNotFoundPage,
		path: '/not-found',
		title: 'Not Found',
		domain: true
	}
};
