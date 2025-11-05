/**
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialState
 * @typedef {import('../../types/stateTypes.js').ShoppingListItem} ShoppingListItem
 * @typedef {import('../../types/recipeTypes.js').ExtendedIngredient} ExtendedIngredient
 */

import { appStore } from '../../appStore.js';
import { banana, bananas } from '../../data/banana.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { IngredientMiniCard } from '../ingredient-mini-card/ingredientMiniCard.controller.js';
import {
	renderInput,
	renderShoppingList,
	renderShoppingListItem
} from './shoppingList.view.js';

export class ShoppingList {
	/**
	 * @param {HTMLElement} container
	 * @param {object} [params={}]
	 * @param {boolean} [params.dev=false]
	 */
	constructor(container, params = {}) {
		/** @type {HTMLElement} */
		this.container = container;

		this.dev = params.dev;
		this.view = stringToHtml(renderShoppingList());

		/** @type {ShoppingListItem[]} */
		this.currentList = [];

		/** @type {IngredientMiniCard[]} */
		this.ingredientCardInstances = [];

		/** @type {Record<number,HTMLButtonElement>} */
		this.removeButtonMap = {};

		/** @type {HTMLButtonElement} */
		this.searchBtn = null;

		this.ul = null;
		this.currentList = appStore.getState().shoppingList || [];
		this.init();
		this.#_render();
		this.subscription = null;
	}

	#_buildIngredientCards() {
		console.log('this.currentList: ', this.currentList);
		console.log('Card instances: ', this.ingredientCardInstances);

		this.currentList.forEach(item => {
			const recipeDetails = {
				linkedRecipe: item.linkedRecipe ?? '',
				linkedRecipeId: item.linkedRecipeId ?? 0
			};

			const tempItem = { ...item };

			delete tempItem.linkedRecipe;
			delete tempItem.linkedRecipeId;

			const itemAsIngredient = /** @type {ExtendedIngredient} */ (tempItem);

			const ingredientCard = new IngredientMiniCard(itemAsIngredient, {
				inRecipeDetail: false,
				system: appStore.getState().unitLocale,
				unitLength: appStore.getState().unitLength,
				...recipeDetails
			});

			const el = ingredientCard.render();
			ingredientCard.init();

			this.ingredientCardInstances.push(ingredientCard);

			this.ul.appendChild(el);
		});
	}

	/**
	 *
	 * @param {HTMLElement} cardEl
	 * @param {()=> void} onDone
	 */
	#_getCardById(id) {
		return this.ingredientCardInstances.find(card => card.ingredient.id === id);
	}

	// #_adaptIngredient(item) {
	// 	const { linkedRecipe, linkedRecipeId, ...ingredient } = item;
	// 	return ingredient;
	// }

	#_removeWithAnimation(cardEl, onDone) {
		cardEl.classList.add('ingredient-mini-card--leaving');

		cardEl.addEventListener(
			'transitionend',
			function handler(e) {
				cardEl.removeEventListener('transitionend', handler);
				// Once done, invoke onDone()
				if (typeof onDone === 'function') onDone();
			},
			{ once: true }
		);
	}

	#_render() {
		if (!this.ul) {
			this.ul = document.createElement('ul');
			this.ul.className = 'shopping-list__ul';
		}

		const shoppingListContainer = document.getElementById(
			'shopping-list-container'
		);
		this.#_buildIngredientCards();
		shoppingListContainer.appendChild(this.ul);

		// if (this.container) {
		// 	// This has been removed because time constraints
		// 	// and api quota constraints have prevented me
		// 	// from implementing the search properly
		// 	// this.#_renderInput();
		// }
	}

	/**
	 *
	 * @param {ShoppingListItem[]} updated
	 */
	#_updateList(updated) {
		const toRemoveIds = this.currentList
			.filter(prev => !updated.some(next => next.id === prev.id))
			.map(i => i.id);

		toRemoveIds.forEach(id => {
			const ingredientCardInstance = this.#_getCardById(id);
			if (ingredientCardInstance && ingredientCardInstance.el) {
				this.#_removeWithAnimation(ingredientCardInstance.el, () => {
					this.updateCards(updated);
				});
			}
		});
	}

	init() {
		this.container.appendChild(this.view);

		this.subscription = appStore.subscribe(state => {
			if (state && state.shoppingList) {
				this.#_updateList(state.shoppingList);
			}
		}, 'shoppingList');

		if (this.dev) {
			// appStore.setState({ shoppingList: [...bananas, ...bananas] });
		}
	}

	updateCards(updated) {
		this.currentList = updated;
		this.#_render();
	}

	// /**
	//  *
	//  * @param {ShoppingListItem} item
	//  */
	// #_addItem(item) {
	// 	const state = appStore.getState();
	// 	const exists = state.shoppingList?.some(
	// 		listItem => listItem.id === item.id
	// 	);
	// 	console.log('Exists: ', exists);
	// 	if (!exists) {
	// 		appStore.setState({ shoppingList: [...(state.shoppingList || [])] });
	// 	}
	// }
	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
