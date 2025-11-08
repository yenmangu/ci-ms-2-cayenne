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
	console.log('loadRecipes params: ', params);
	const client = getClient();
	const array = params.search.split(',');
	console.log('Array: ', array);

	const recipes = /** @type {RecipeCard[]} */ (
		(await client.findByIngredients(array, 10)).data
	);

	// const recipes = getRecipes()
	const grid = new RecipeGrid(appRoot, recipes, { search: array });
	grid.render();
	return grid;
}
