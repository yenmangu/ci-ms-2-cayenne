/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 * @typedef {import('../types/responseTypes.js').FetchResult} FetchResult
 */

import { getClient } from '../api/client.singleton.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';

export async function recipes(appRoot, path, params) {
	console.log('Recipe.js');

	const grid = await loadRecipes(appRoot, path, params);
	if (grid) return grid;
}
/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} path
 * @param {Record<'search', *> & { __preload?: {data?: any}, [key:string]: any}} params
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

	if (params?.__preload) {
		console.log('Preloaded - using cached:  ', params.__preload.data);

		const raw = params.__preload.data;
		const recipeCards = Array.isArray(raw)
			? raw
			: toRecipeCardsFromResults(raw);
		console.log('RecipeCards');

		const grid = new RecipeGrid(appRoot, recipeCards, { search: array });
		grid.render();
		return grid;
	}

	try {
		/** @type {FetchResult} */
		const resp = await client.findByIngredients(array, 10);
		if (!resp) return null;
		const raw = resp.data;
		recipeCards = Array.isArray(raw) ? raw : toRecipeCardsFromResults(raw);
	} catch (err) {
		return null;
	}

	const grid = new RecipeGrid(appRoot, recipeCards, { search: array });

	// const recipes = getRecipes()
	grid.render();
	return grid;
}

/**
 * Normalise cached `{ results: [...] }` to RecipeCard[]
 * @param {{ results?: Array<{id:number,title:string,image:string,imageType?:string}> }} payload
 * @returns {RecipeCard[]}
 */
function toRecipeCardsFromResults(payload) {
	const list = Array.isArray(payload?.results) ? payload.results : [];
	return list.map(r => ({ id: r.id, title: r.title, image: r.image }));
}
