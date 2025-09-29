/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { appStore } from '../../appStore.js';
import * as service from './RecipeCard.service.js';
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
		this.service = service.createCardService();
		/** @type {HTMLElement} */
		this.cardEl = null;

		/**
		 * @type {Record<
		 * string,HTMLElement|
		 * HTMLAnchorElement|
		 * HTMLImageElement|
		 * HTMLButtonElement
		 * >}
		 */
		this.cardElementMapping = null;
		this.init();
	}
	init() {
		this.cardEl = stringToHtml(renderRecipeCard(this.recipe));
		const cardElementMapping = {
			title: /** @type {HTMLElement} */ (
				this.cardEl.querySelector('h5.card-title')
			),
			image: this.cardEl.querySelector('img'),
			anchor: this.cardEl.querySelector('a'),
			likeBtn: /** @type {HTMLButtonElement} */ (
				this.cardEl.querySelector('[data-like-btn]')
			)
		};
		this.cardElementMapping = cardElementMapping;
		this.cardElementMapping.likeBtn.addEventListener('click', e => {
			// Important as mounted inside an anchor link
			e.preventDefault();
			e.stopPropagation();
			this.#_onLikeClicked();
		});
	}

	#_onLikeClicked() {
		this.service.onSaveClick(this.recipe);
	}

	render() {
		this.parent.innerHTML = '';
		this.parent.appendChild(this.cardEl);
	}

	/**
	 *
	 * @param {RecipeCardObject} newRecipeCardData
	 */
	update(newRecipeCardData = {}) {
		for (const [key, val] of Object.entries(newRecipeCardData)) {
			if (key === 'id') {
				if (this.cardElementMapping.anchor instanceof HTMLAnchorElement) {
					this.cardElementMapping.anchor.href = `#recipe?id=${newRecipeCardData.id}`;
				}
			}
			if (key === 'image') {
				if (this.cardElementMapping.image instanceof HTMLImageElement) {
					this.cardElementMapping.image.src = newRecipeCardData.image;
					this.cardElementMapping.image.alt = newRecipeCardData.title;
				}
			}
			if (key === 'title') {
				this.cardElementMapping.title.innerHTML = newRecipeCardData.title;
			}
		}
		this.recipe = newRecipeCardData;
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
