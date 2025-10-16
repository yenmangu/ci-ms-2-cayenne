/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 * @typedef {import('../../types/recipeTypes.js').RecipeCardElementMap} CardElementMap
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
		 * @type {CardElementMap}
		 */
		this.cardElementMapping = null;
		this.likeBtn = null;
		this.subscription = null;
		this.init();
	}
	init() {
		this.subscription = appStore.subscribe(state => {
			// console.log('State in recipeCardController: ', state);

			const found = state.likedRecipes.some(r => r.id === this.recipe.id);

			const icon = this.cardElementMapping.likeBtn?.querySelector('i');
			if (!icon) {
				throw new Error(
					`Like button icon not found for recipe id: ${this.recipe.id}`
				);
			}
			this.#_toggleIcon(icon, found);
		}, 'likedRecipes');
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

	/**
	 *
	 * @param {HTMLElement} icon
	 * @param {boolean} [on=true]
	 */
	#_toggleIcon(icon, on = true) {
		if (on) {
			icon.classList.remove('fa-regular');
			icon.classList.add('fa-solid');
		} else {
			icon.classList.remove('fa-solid');
			icon.classList.add('fa-regular');
		}
		const likeBtn = this.cardElementMapping.likeBtn;
		if (!likeBtn) {
			throw new Error('Cannot find like button');
		}
		this.cardElementMapping.likeBtn.setAttribute(
			'aria-pressed',
			on ? 'true' : 'false'
		);
		this.cardElementMapping.likeBtn.setAttribute(
			'title',
			on ? 'Remove like' : 'Like this recipe'
		);
		const likeText = this.cardElementMapping.likeBtn.querySelector(
			'span.btn__like-text'
		);
		if (!likeText) {
			throw new Error('Cannot update like text: Cannot find element.');
		}
		likeText.textContent = on ? 'Remove like' : 'Like this recipe';
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
					this.cardElementMapping.anchor.href = `#/recipe?id=${newRecipeCardData.id}`;
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
		if (this.subscription) this.subscription.unsubscribe;
	}
}
