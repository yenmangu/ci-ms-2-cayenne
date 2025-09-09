/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { RecipeCard } from '../recipe-card/controller.js';
import { renderGridContainer } from './view.js';
// import { RecipeCard } from "../recipe-card/controller.js";

export class RecipeGrid {
	/**
	 *
	 * @param {RecipeCardObject[]} recipes
	 * @param {Object} opts
	 */
	constructor(recipes, opts = {}) {
		/** @type {RecipeCardObject[]} */ this.recipes = recipes;
		/** @type {Object} */ this.opts = opts;
		this.container = document.getElementById('app');
	}

	render() {
		this.container.innerHTML = renderGridContainer();
		const grid = document.getElementById('recipeGrid');
		if (!grid) {
			throw new Error(`[Recipe Grid Controller] Recipe grid not found`);
		}

		this.recipes.forEach((recipe, index) => {
			const wrapper = document.createElement('div');
			const card = new RecipeCard(recipe, wrapper);
			card.render();
			grid.appendChild(wrapper);
		});
	}

	destroy() {
		this.container.innerHTML = '';
	}
}
