/**
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { RecipeGrid } from '../recipe-grid/recipeGrid.controller.js';
import * as service from './likedRecipes.service.js';

export class LikedRecipes {
	/**
	 * @param {HTMLElement} container
	 * @param {RecipeCard[]} recipes
	 */
	constructor(container, recipes = []) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {RecipeCard[]} */
		this.recipes = recipes;
		/** @type {RecipeGrid} */
		this.grid = null;
		this.init();
	}

	init() {
		this.grid = new RecipeGrid(this.container, this.recipes);
		console.log('Recipes in likedRecipes: ', this.recipes);

		this.grid.render();
	}
	render() {
		console.warn('Function render() not yet implemented.');
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
