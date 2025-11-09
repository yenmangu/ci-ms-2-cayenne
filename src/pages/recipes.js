/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 * @typedef {import('../types/responseTypes.js').FetchResult} FetchResult
 */

import { getClient } from '../api/client.singleton.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';

export async function recipes(appRoot, path, params) {
	const grid = await loadRecipes(appRoot, path, params);
	return grid || null;
}
/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} path
 * @param {Record<'search', *>} params
 */
export async function loadRecipes(appRoot, path, params) {
	console.trace('loadRecipes params: ', params);
	const client = getClient();

	const array =
		typeof params.search === 'string'
			? params.search.split(',')
			: Array.isArray(params.search)
			? params.search
			: [];
	console.log('Array: ', array);
	/** @type {RecipeCard[]} */
	let recipeCards;
	try {
		/** @type {FetchResult} */
		const resp = await client.findByIngredients(array, 10);
		if (!resp) {
			return null;
		}
		if (resp) {
			recipeCards = /** @type {RecipeCard[]} */ (resp.data);
		}
	} catch (err) {
		throw null;
	}

	// const recipes = getRecipes()
	const grid = new RecipeGrid(appRoot, recipeCards, { search: array });
	grid.render();
	return grid;
}
