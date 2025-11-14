/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 * @typedef {import('../types/responseTypes.js').FetchResult} FetchResult
 */

import { getClient } from '../api/client.singleton.js';
import { appStore } from '../appStore.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';
import { createErrorPublishing } from '../error/pipe/publishFactory.js';
import { getCurrentRouteScope } from '../error/util/errorScope.js';

export async function recipes(appRoot, path, params) {
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
	const pubs = createErrorPublishing();
	const scope = getCurrentRouteScope();
	const client = getClient();

	const array =
		typeof params.search === 'string'
			? params.search.split(',')
			: Array.isArray(params.search)
			? params.search
			: [];
	/** @type {RecipeCard[]} */
	let recipeCards;

	if (params?.__preload) {
		const raw = params.__preload.data;
		const recipeCards = Array.isArray(raw)
			? raw
			: toRecipeCardsFromResults(raw);

		const grid = new RecipeGrid(appRoot, recipeCards, { search: array });
		grid.render();
		return grid;
	}

	try {
		/** @type {FetchResult} */
		const resp = await client.findByIngredients(array, 10);

		if (!resp) return null;
		if (!resp.meta) {
			pubs.routeError(appStore, scope, new Error('No meta in fetch response'));
		}

		const raw = resp.data;
		if (!raw) {
			recipeCards = [];
		}
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
