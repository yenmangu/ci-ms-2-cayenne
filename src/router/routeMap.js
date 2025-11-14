/**
 * @typedef {import("../types/routerTypes.js").RouteMap} RouteMap
 */

import { loadNotFoundPage } from '../pages/404.js';
import { loadHome } from '../pages/cayenne.js';
import { loadLikedRecipes } from '../pages/likedRecipes.js';
import { loadRecipeDetail } from '../pages/recipe.js';
import { recipes } from '../pages/recipes.js';
import { loadShoppingList } from '../pages/shoppingList.js';
import { escapeHtml } from '../util/escapeHtml.js';

export const NOT_FOUND = '/not-found';

/** @type {RouteMap} */
export const routeMap = {
	'/': {
		domain: true,
		handler: loadHome,
		icon: 'house',
		path: '/',
		showInNav: true,
		title: 'Home'
	},

	'/recipe': {
		domain: true,
		handler: loadRecipeDetail,
		path: '/recipe',
		title: 'Recipe Detail',

		validate(params) {
			const allowed = ['id'];

			for (const [key, val] of Object.entries(params)) {
				if (!allowed.includes(key)) {
					return false;
				}
				if (!parseInt(val)) {
					return false;
				}

				const re = /\D*/g;
				if (!re.test(val)) {
					return false;
				}
			}

			return Boolean(params.id);
		}
	},

	'/recipe-grid': {
		handler: recipes,
		path: '/recipe-grid',
		title: 'Recipe Results',
		validate(params) {
			if (Array.isArray(params.search)) {
				params.search.forEach(s => {
					return escapeHtml(s) !== null;
				});
				return true;
			}
			return escapeHtml(params.search) !== null;
		}
	},

	'/saved-recipes': {
		domain: true,
		handler: loadLikedRecipes,
		icon: 'wishlist.svg',
		path: '/saved-recipes',
		showInNav: true,
		title: 'Saved Recipes',
		useOwnIcon: true
	},

	'/shopping-list': {
		domain: true,
		handler: loadShoppingList,
		icon: 'basket-shopping',
		path: '/shopping-list',
		showInNav: true,
		title: 'Shopping List'
	},

	[NOT_FOUND]: {
		domain: true,
		handler: loadNotFoundPage,
		path: '/not-found',
		title: 'Not Found'
	}
};
