/**
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { appStore } from '../../appStore.js';
import { RecipeGrid } from '../recipe-grid/recipeGrid.controller.js';
import * as service from './likedRecipes.service.js';

export class LikedRecipes {
	/**
	 * @param {HTMLElement} container
	 * @param {object} [params]
	 * @param {string} [params.title]
	 * @param {RecipeCard[]} [params.recipes]
	 */
	constructor(container, params = {}) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {string} */
		this.title = params.title;

		/** @type {RecipeCard[]} */
		this.recipes = params.recipes;

		/** @type {RecipeGrid} */
		this.grid = null;

		this.subscription = null;

		this.init();
	}

	init() {
		this.subscription = appStore.subscribe(state => {
			if (state && state.likedRecipes) {
				this.recipes = state.likedRecipes;
				this.grid.onGridUpdate(state.likedRecipes, true);
			}
		}, 'likedRecipes');

		this.grid = new RecipeGrid(this.container, this.recipes, {
			title: this.title
		});

		// console.log('Recipes in likedRecipes: ', this.recipes);
		this.grid.render();
	}

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}
}
