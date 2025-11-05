/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 * @typedef {import('../../types/recipeTypes.js').RecipeCardElementMap} CardElementMap
 */

import { appStore } from '../../appStore.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import * as service from './RecipeCard.service.js';

import { renderRecipeCard } from './recipeCard.view.js';

export class RecipeCard {
	/**
	 *
	 * @param {HTMLElement} parentElement
	 * @param {RecipeCardObject} recipe
	 */
	constructor(parentElement, recipe) {
		/** @type {HTMLElement} */
		this.parent = parentElement;

		/** @type {RecipeCardObject} */
		this.recipe = recipe;

		/** @type {number} */
		this.id = recipe.id;

		this.service = service.createCardService();

		/** @type {HTMLElement} */
		this.cardEl = null;

		/** @type {HTMLElement} */
		this.icon = null;

		/**
		 * @type {CardElementMap}
		 */
		this.cardElementMapping = null;
		this.likeBtn = null;
		this.subscription = null;
		this.init();
	}
	#_checkIsLiked() {
		const liked = appStore.getState().likedRecipes || [];
		const isLiked = liked.some(r => r.id === this.recipe.id);
		this.#_toggleIcon(this.icon, isLiked);
	}

	#_onLikeClicked() {
		this.service.onSaveClick(this.recipe);
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

	init() {
		this.cardEl = stringToHtml(renderRecipeCard(this.recipe));
		const cardElementMapping = {
			anchor: this.cardEl.querySelector('a'),
			image: this.cardEl.querySelector('img'),
			likeBtn: /** @type {HTMLButtonElement} */ (
				this.cardEl.querySelector('[data-like-btn]')
			),
			title: /** @type {HTMLElement} */ (
				this.cardEl.querySelector('h5.card-title')
			)
		};
		this.cardElementMapping = cardElementMapping;

		this.subscription = appStore
			// Subscribe immediately to the state
			.subscribe(state => {
				let found;
				if (state && state.likedRecipes) {
					found = state.likedRecipes.some(r => r.id === this.recipe.id);
				}

				this.icon = this.cardElementMapping.likeBtn?.querySelector('i');
				if (!this.icon) {
					throw new Error(
						`Like button icon not found for recipe id: ${this.recipe.id}`
					);
				}
				this.#_toggleIcon(this.icon, found);
			}, 'likedRecipes')
			// })
			.immediate();

		this.cardElementMapping.likeBtn.addEventListener('click', e => {
			// Important as mounted inside an anchor link
			e.preventDefault();
			e.stopPropagation();
			this.#_onLikeClicked();
		});
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
		this.icon = this.cardElementMapping.likeBtn?.querySelector('i');
		this.#_checkIsLiked();
	}

	destroy() {
		this.parent.innerHTML = '';
		if (this.subscription) this.subscription.unsubscribe();
	}
}
