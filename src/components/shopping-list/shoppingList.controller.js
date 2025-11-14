/**
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialState
 * @typedef {import('../../types/stateTypes.js').ShoppingListItem} ShoppingListItem
 * @typedef {import('../../types/recipeTypes.js').ExtendedIngredient} ExtendedIngredient
 */

import { appStore } from '../../appStore.js';
import { singleEmitter } from '../../event/eventBus.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { IngredientMiniCard } from '../ingredient-mini-card/ingredientMiniCard.controller.js';
import { renderShoppingList } from './shoppingList.view.js';

export class ShoppingList {
	/**
	 * @param {HTMLElement} container
	 * @param {object} [params={}]
	 * @param {boolean} [params.dev=false]
	 */
	constructor(container, params = {}) {
		/** @type {HTMLElement} */
		this.container = container;

		this.dev = appStore.getState().devMode;
		this.view = stringToHtml(renderShoppingList());

		/** @type {ShoppingListItem[]} */
		this.currentList = [];

		/** @type {Record<number,HTMLButtonElement>} */
		this.removeButtonMap = {};

		/** @type {HTMLButtonElement} */
		this.searchBtn = null;

		/** @type {Map<number,IngredientMiniCard>} */
		this.cardsById = new Map();

		/** @type {Set<number>} */
		this.pendingExit = new Set();

		this.ul = null;
		this.subscription = null;

		this.removeCardEmitter = singleEmitter;

		this.removeSub = null;

		this.#_render();
	}

	#_render() {
		if (!this.ul) {
			this.ul = document.createElement('ul');
			this.ul.className = 'shopping-list__ul';
		}
	}

	#_buildInitialList() {
		this.currentList.forEach(item => {
			if (this.cardsById.has(item.id)) return;
			const recipeDetails = {
				linkedRecipe: item.linkedRecipe ?? '',
				linkedRecipeId: item.linkedRecipeId ?? 0
			};

			const itemAsIngredient = /** @type {ExtendedIngredient} */ (item);

			const card = new IngredientMiniCard(itemAsIngredient, {
				inRecipeDetail: false,
				system: appStore.getState().unitLocale,
				unitLength: appStore.getState().unitLength,
				linkedRecipeId: recipeDetails.linkedRecipeId,
				linkedRecipe: recipeDetails.linkedRecipe
			});

			const el = card.buildEl();
			this.cardsById.set(card.id, card);
			card.init();
			this.ul.appendChild(el);
		});
		this.container.appendChild(this.ul);
	}

	init() {
		this.cardsById.clear();
		this.container.appendChild(this.view);
		if (this.currentList) this.currentList = [];
		this.currentList = appStore.getState().shoppingList || [];
		this.#_buildInitialList();

		this.subscription = appStore.subscribe(({ shoppingList }) => {
			this.currentList = shoppingList;
		}, 'shoppingList');

		if (this.dev) {
			// appStore.setState({ shoppingList: [...bananas, ...bananas] });
		}
		/**
		 *
		 * @param {string} event
		 * @param {ExtendedIngredient} payload
		 */
		const handler = (event, payload) => {
			const id = payload.id;
			this.#_handleRemoveIntent(id);
		};
		this.removeSub = this.removeCardEmitter.subscribe('card:remove', handler);
	}

	/** @param {number} id  */
	#_handleRemoveIntent(id) {
		if (!id || this.pendingExit.has(id)) {
			return;
		}
		const card = this.cardsById.get(id);
		if (!card) {
			appStore.removeIngredientById(id);
			return;
		}
		this.pendingExit.add(id);

		card
			.removeSelf()
			.then(() => {
				appStore.removeIngredientById(id);
				card.destroy();
				this.cardsById.delete(id);
			})
			.finally(() => this.pendingExit.delete(id));
	}

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
		if (this.removeSub) {
			this.removeSub.unsubscribe();
			this.removeSub = null;
		}
		this.cardsById.forEach(i => {
			i.destroy();
		});
		this.container.innerHTML = '';
	}
}
