/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { stringToHtml } from '../../util/htmlToElement.js';
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

		/** @type {HTMLElement} */
		this.cardEl = null;
		this.init();
	}
	init() {
		this.cardEl = stringToHtml(renderRecipeCard(this.recipe));
	}

	render() {
		this.parent.appendChild(this.cardEl);
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
