/**
 * @typedef {import('../components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */

import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';
import { ErrorMessage } from '../components/error-message/errorMessage.controller.js';

function fakeFetchRecipes() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(multipleRecipes);
		}, 100); // Simulate Network Delay
	});
}

/**
 *
 * @param {HTMLElement} appEl
 */
export async function initCayenneApp(appEl) {
	// This function currently
	const grid = new RecipeGrid(appEl, []);
	grid.setLoading(true);
	grid.render();

	// Dev - uncomment below to only show skeletons
	// return;

	// TODO Implement live API calls
	try {
		const recipes = await fakeFetchRecipes();

		// Executed after promise resolves
		grid.setLoading(false);
		grid.updateCards(recipes);
		grid.render();
	} catch (error) {
		grid.setLoading(false);
		showErrorMessage(appEl, error);
	}
}

/**
 *
 * @param {HTMLElement} appEl
 * @param {any} err // 'any' for now
 */
function showErrorMessage(appEl, err) {
	const config = /** @type {ErrorConfig} */ ({});
	config.container = appEl;
	const error = new ErrorMessage(config);
	error.render();
}
