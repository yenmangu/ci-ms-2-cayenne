/**
 * @typedef {import('../types/componentTypes.js').RecipeGridParams} RecipeGridParams
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';

/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} path
 * @param {RecipeGridParams} params
 */
export function loadRecipes(appRoot, path, params) {
	const grid = new RecipeGrid(appRoot, params.recipes);
	grid.render();
}
