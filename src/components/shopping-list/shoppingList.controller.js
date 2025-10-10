/**
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialState
 * @typedef {import('../../types/ingredientTypes.js').IngredientResultCard} IngredientResult
 */

import { appStore } from '../../appStore.js';
import { banana, bananas } from '../../data/banana.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import * as service from './shoppingList.service.js';
import { renderInput, renderShoppingListItem } from './shoppingList.view.js';

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

		/** @type {IngredientResult[]} */
		this.currentList = [];

		/** @type {Record<number,HTMLButtonElement>} */
		this.removeButtonMap = {};

		/** @type {HTMLButtonElement} */
		this.searchBtn = null;

		if (this.container) {
			this.#_renderInput();
			const ul = document.createElement('ul');
			this.ul = ul;
			this.container.appendChild(ul);
		}
		this.currentList = appStore.getState().shoppingList || [];

		this.#_render();
	}

	init() {
		appStore.subscribe(state => {
			console.log('State: ', state);

			if (state) {
				console.log('ShoppingList: ', state.shoppingList);

				this.currentList = state.shoppingList;
				console.log('CurrentList: ', this.currentList);

				this.#_render();
			}
		}, 'shoppingList');
		if (this.dev) {
			appStore.setState({ shoppingList: [...bananas, ...bananas] });
		}
	}

	#_renderInput() {
		this.formElement = stringToHtml(renderInput());
		this.container.appendChild(this.formElement);
		this.formElement.addEventListener(
			'submit',
			this.#_wireSearchListener.bind(this)
		);
	}

	#_render() {
		this.ul.innerHTML = '';
		this.currentList.forEach(item => {
			const listItem = stringToHtml(renderShoppingListItem(item));
			this.ul.appendChild(listItem);
			const removeBtn = /** @type {HTMLButtonElement} */ (
				listItem.querySelector('button[data-remove-item-btn]')
			);
			if (removeBtn) {
				removeBtn.addEventListener(
					'click',
					this.#_wireRemoveListeners.bind(this)
				);
				this.removeButtonMap[item.id] = removeBtn;
			} else {
				console.log(`Cannot find remove button for item id: ${item.id}`);
			}
		});
	}

	#_wireSearchListener() {}

	/**
	 *
	 * @param {MouseEvent} event
	 */
	#_wireRemoveListeners(event) {
		const btn = event.currentTarget;
		if (btn instanceof HTMLButtonElement) {
			const id = btn.dataset.ingredientId;
			const li = btn.closest('li[data-shopping-item]');
			if (li) li.remove();

			this.#_removeItem(id);
		}
	}

	/**
	 *
	 * @param {IngredientResult} item
	 */
	#_addItem(item) {
		const state = appStore.getState();
		const exists = state.shoppingList?.some(
			listItem => listItem.id === item.id
		);
		console.log('Exists: ', exists);

		if (!exists) {
			appStore.setState({ shoppingList: [...(state.shoppingList || [])] });
		}
	}

	/**
	 *
	 * @param {string} id
	 */
	#_removeItem(id) {
		const intId = parseInt(id, 10);
		const state = appStore.getState();
		const filteredList = state.shoppingList.filter(i => {
			if (i.id === intId) {
				console.log(`found item with id: ${id} : name: ${i.name}`);
			}
			return i.id !== intId;
		});

		console.log('filteredList: ', filteredList);

		appStore.setState({ shoppingList: filteredList });
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
