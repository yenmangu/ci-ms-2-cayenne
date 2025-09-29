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
		this.parent.innerHTML = '';
		this.parent.appendChild(this.cardEl);
	}

	/**
	 *
	 * @param {RecipeCardObject} newRecipeCardData
	 */
	update(newRecipeCardData) {
		if (this.cardEl) {
			const title = this.cardEl.querySelector('h5.card-title');
			const image = this.cardEl.querySelector('img');
			// const anchor = /** @type {HTMLAnchorElement} */ (
			// 	stringToHtml(this.cardEl.outerHTML)
			// );
			const cardAsAnchor = /** @type {HTMLAnchorElement} */ (this.cardEl);
			cardAsAnchor.href = `#recipe?id=${newRecipeCardData.id}`;
			image.src = newRecipeCardData.image;
			image.alt = newRecipeCardData.title;
			title.innerHTML = newRecipeCardData.title;
		}
		this.recipe = newRecipeCardData;
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
