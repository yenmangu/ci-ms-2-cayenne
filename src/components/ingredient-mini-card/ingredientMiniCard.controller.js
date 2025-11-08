/**
 * @typedef {import('../../types/recipeTypes.js').ExtendedIngredient} Ingredient
 * @typedef {import('../../types/stateTypes.js').ShoppingListItem} ShoppingListItem
 * @typedef {import('../../types/recipeTypes.js').IngredientMiniCardOpts} Opts
 */

import { appStore } from '../../appStore.js';
import { iconButtonConfigs } from '../../data/icons/index.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { getIconRegistry } from '../../util/icon/icon-component/icon.service.js';
import { IconButton } from '../../util/icon/icon-component/iconButton.controller.js';
import { renderIngredientMiniCard } from './ingredientMiniCard.view.js';

export class IngredientMiniCard {
	/**

	 * @param {Ingredient} ingredient
	 * @param {object} [opts]
	 * @param {boolean} [opts.inRecipeDetail=true]
	 * @param {'metric'|'us'} [opts.system]
	 * @param {'unitShort'|'unitLong'} [opts.unitLength]
	 * @param {number} [opts.linkedRecipeId]
	 * @param {string} [opts.linkedRecipe]
	 *
	 */
	constructor(ingredient, opts = { inRecipeDetail: true }) {
		/** @type {Ingredient} */
		this.ingredient = ingredient;

		this.opts = opts;

		this.iconRegistry = getIconRegistry();

		/** @type {HTMLElement} */
		this.el = this.render();

		/**
		 * @type {{
		 * 	system?: 'metric' | 'us',
		 * 	unitLength?: 'unitShort'|'unitLong',
		 * 	linkedRecipeId?: number,
		 * 	linkedRecipe?: string,
		 * }}
		 */

		/** @type {HTMLElement} */
		this.miniCardEl = null;

		this.subscription = null;

		/** @type {IconButton} */
		this.icon = null;
	}

	/**
	 *
	 * @param {MouseEvent} e
	 */
	#_handleShoppingListClick(e) {
		e.preventDefault();
		this.#_updateState();
	}

	/**
	 *
	 * @param {HTMLElement} container
	 */
	#_insertIcon(container) {
		const cartIconOptions = iconButtonConfigs.cart(false, undefined, 'solid');
		this.icon = new IconButton(this.iconRegistry, {
			...cartIconOptions,

			onClick: (e, btn) => {
				console.log(`Shopping list clicked for ${this.ingredient.name}`);
				this.#_handleShoppingListClick(e);
			}
		});
		this.icon.mount(container);
	}

	#_updateState() {
		/** @type {ShoppingListItem} */
		const itemToStore = {
			id: this.ingredient.id,
			image: this.ingredient.image,
			linkedRecipe: this.opts.linkedRecipe ?? '',
			linkedRecipeId: this.opts.linkedRecipeId ?? null,
			name: this.ingredient.name
		};
		appStore.toggleIngredientInCart(itemToStore);
	}

	init() {
		this.subscription = appStore
			.subscribe(state => {
				const inList = state.shoppingList.some(
					i => i.id === this.ingredient.id
				);
				this.icon.setToggled(inList);
			}, 'shoppingList')
			.immediate();
	}

	/**
	 *
	 * @returns {HTMLElement}
	 */
	render() {
		const wrapper = document.createElement('div');
		wrapper.className = 'ingredient-mini-card__wrapper';
		this.miniCardString = renderIngredientMiniCard(
			this.ingredient,
			this.opts.system || 'metric',
			this.opts.unitLength || 'unitShort',
			{
				...this.opts
			}
		);
		this.miniCardEl = stringToHtml(this.miniCardString);
		const iconInsertion = /** @type {HTMLElement} */ (
			this.miniCardEl.querySelector('div.ingredient-mini-card__icon-insert')
		);
		if (iconInsertion) {
			this.#_insertIcon(iconInsertion);
			if (this.opts.inRecipeDetail) {
				iconInsertion.classList.add(
					'ingredient-mini-card__icon-insert--in-recipe'
				);
			}
		}
		wrapper.appendChild(this.miniCardEl);
		this.el = wrapper;
		return this.el;
	}

	destroy() {
		this.subscription.unsubscribe();
		this.subscription = null;
		this.el.innerHTML = '';
	}
}
