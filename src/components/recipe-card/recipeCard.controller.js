/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { renderRecipeCard } from './recipeCard.view.js';

export class RecipeCard {
	/**
	 *
	 * @param {HTMLElement} parentElement
	 * @param {RecipeCardObject} recipe
	 */
	constructor(parentElement, recipe) {
		/** @type {HTMLElement} */ this.parent = parentElement;
		/** @type {RecipeCardObject} */ this.recipe = recipe;
	}

	render() {
		this.parent.innerHTML = renderRecipeCard(this.recipe);
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
