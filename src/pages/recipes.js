/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';
import { SpoonacularClient } from '../api/client.js';

/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} path
 * @param {Record<'search', *>} params
 */
export async function loadRecipes(appRoot, path, params) {
	console.log('loadRecipes params: ', params);
	const client = new SpoonacularClient();
	const array = params.search.split(',');
	console.log('Array: ', array);

	const recipes = await client.findByIngredients(array, 10, true);

	// const recipes = getRecipes()
	const grid = new RecipeGrid(appRoot, recipes);
	grid.render();
}

// /**
//  * @returns {RecipeCard[]}
//  */
// function getRecipes() {

// }
