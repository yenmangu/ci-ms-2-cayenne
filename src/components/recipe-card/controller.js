/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { renderRecipeCard } from './view.js';

export class RecipeCard {
	/**
	 *
	 * @param {RecipeCardObject} recipe
	 * @param {HTMLElement} parentElement
	 */
	constructor(recipe, parentElement) {
		/** @type {RecipeCardObject} */ this.recipe = recipe;
		/** @type {HTMLElement} */ this.parent = parentElement;
	}

	render() {
		this.parent.innerHTML = renderRecipeCard(this.recipe);
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
