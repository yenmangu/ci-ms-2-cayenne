import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';
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
	const landing = initCayenneApp(appRoot, pathName, params);
	return landing || null;
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
		await landing.init();
		landing.render();
		return landing;
	}

	try {
	} catch (error) {
		throw error;
	}
}
