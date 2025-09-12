/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 */

import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';

/**
 *
 * @param {HTMLElement} appRoot
 * @param {RecipeGridParams} [params={}]
 * @param {string} [path='']
 */
export function initRecipesPage(appRoot, params, path = '') {
	const grid = new RecipeGrid(appRoot, multipleRecipes);
	grid.render();
}
