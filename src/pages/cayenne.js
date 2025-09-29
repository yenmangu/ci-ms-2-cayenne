/**
 * @typedef {import('../components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */

import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';
import { ErrorMessage } from '../components/error-message/errorMessage.controller.js';
import { RecipeDetail } from '../components/recipe-detail/recipeDetail.controller.js';
import { LandingPage } from '../components/landing-page/landingPage.controller.js';

/**
 * The public '/' route handler
 *
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {Record<string, string>} [params]
 */
export function loadHome(appRoot, pathName, params) {
	initCayenneApp(appRoot, pathName, params);
}

/**
 * Use local data to test the recipeGrid
 *
 * @returns
 */
function fakeFetchRecipes() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(multipleRecipes);
		}, 100); // Simulate Network Delay
	});
}

/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {Record<string, string>} [params]
 */
export async function initCayenneApp(appRoot, pathName, params) {
	appRoot.innerHTML = '';
	// CURRENTLY TESTING
	const testId = 716429;
	// const detail = new RecipeDetail(appRoot, testId);
	// detail.publicTest();

	// New landing logic

	const landing = new LandingPage(appRoot);
	if (landing) {
		console.log('Landing found');

		await landing.init();
		landing.render();
	}

	try {
	} catch (error) {
		showErrorMessage(appRoot, error);
	}

	// const grid = new RecipeGrid(appRoot, []);
	// grid.setLoading(true);
	// grid.render();

	// Dev - uncomment below to only show skeletons
	// return;

	// TODO Implement live API calls
	// try {
	// 	const recipes = await grid.service.getTestRecipes();
	// 	// const recipes = await fakeFetchRecipes();

	// 	// Executed after promise resolves
	// 	grid.setLoading(false);
	// 	grid.updateCards(recipes);
	// 	grid.render();
	// } catch (error) {
	// 	grid.setLoading(false);
	// 	showErrorMessage(appRoot, error);
	// }
}

/**
 *
 * @param {HTMLElement} appRoot
 * @param {any} err // 'any' for now
 */
function showErrorMessage(appRoot, err) {
	const config = /** @type {ErrorConfig} */ ({});
	config.container = appRoot;
	const error = new ErrorMessage(config);
	error.render();
}
