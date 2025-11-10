import { LandingPage } from '../components/landing-page/landingPage.controller.js';
import { multipleRecipes } from '../data/multipleRecipes.js';

/**
 * The public '/' route handler
 *
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {Record<string, string& {__preload?: {data?: any}, [key: string]:any}>} [params]
 */
export function loadHome(appRoot, pathName, params) {
	// if (params?.__preload) {
	// 	const raw = params.__preload.data;
	// 	const landing = initCayenneApp(appRoot, pathName, { ...params });
	// }
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
