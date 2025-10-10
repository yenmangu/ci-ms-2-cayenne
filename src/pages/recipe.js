/**
 * @typedef {import("../types/componentTypes.js").RecipeDetailParams} RecipeParams
 */

import { RecipeDetail } from '../components/recipe-detail/recipeDetail.controller.js';

/**
 *
 * @param {HTMLElement} container
 * @param {string} pathName
 * @param {Record<string, string | number>} params
 */
export async function loadRecipeDetail(container, pathName, params = {}) {
	// Clear the container
	container.innerHTML = '';

	const { id } = params;
	console.log('ID from recipe domain: ', id);

	const recipeId = typeof id === 'string' ? parseInt(id) : id;

	/**
	 * @type {RecipeParams}
	 */
	const recipeDetailParams = { recipeId };

	const recipeDetail = new RecipeDetail(container, recipeDetailParams);
	try {
		// TODO: Implement live data
		await recipeDetail.publicTest();
		if (recipeDetail.componentReady) {
			recipeDetail.render();
		}
	} catch (err) {
		console.error('error: ', err);
	}
	// recipeDetail.fetchRecipe();
}
