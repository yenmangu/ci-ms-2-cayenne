/**
 * @typedef {import('../../types/recipeTypes.js').ExtendedIngredient} ExtendedIngredient
 * @typedef {import('../../types/stateTypes.js').ShoppingListItem} ShoppingListItem
 * @typedef {import('../../types/recipeTypes.js').IngredientMiniCardOpts} Opts
 */

// /**
// * @typedef {object} Timeout
// * @prop {boolean} _called
// * @prop {number} _idleTimeout
// * @prop {object} _idlePrev
// * @prop {object} _idleNext
// * @prop {number} _idleStart
// * @prop {function} _onTimeout
// * @prop {any[]} _timerArgs
// * @prop {number} _repeat
// * @prop {boolean} _destroyed
// */

import { appStore } from '../../appStore.js';
import { iconButtonConfigs } from '../../data/icons/index.js';
import { singleEmitter } from '../../event/eventBus.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { getIconRegistry } from '../../util/icon/icon-component/icon.service.js';
import { IconButton } from '../../util/icon/icon-component/iconButton.controller.js';
import { renderIngredientMiniCard } from './ingredientMiniCard.view.js';

export class IngredientMiniCard {
	/**

	 * @param {ExtendedIngredient} ingredient
	 * @param {object} [opts]
	 * @param {boolean} [opts.inRecipeDetail=true]
	 * @param {'metric'|'us'} [opts.system]
	 * @param {'unitShort'|'unitLong'} [opts.unitLength]
	 * @param {number} [opts.linkedRecipeId]
	 * @param {string} [opts.linkedRecipe]
	 *
	 */
	constructor(ingredient, opts = { inRecipeDetail: true }) {
		/** @type {ExtendedIngredient} */
		this.ingredient = ingredient;

		/** @type {number} */
		this.id = ingredient.id;

		this.opts = opts;

		/** @type {boolean} */
		this.inRecipeDetail = opts.inRecipeDetail ?? false;

		this.iconRegistry = getIconRegistry();

		/** @type {HTMLElement} */
		this.el = this.buildEl();

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

		this.unsub = null;

		/** @type {IconButton} */
		this.icon = null;

		this.emitter = singleEmitter;

		/** @type {Promise<void> | undefined} */
		this._exitPromise = undefined;

		/** @type {number | undefined} */
		this._exitFallbackTimer = undefined;
	}

	/**
	 *
	 * @param {MouseEvent} e
	 */
	#_handleShoppingListClick(e) {
		e.preventDefault();

		this.#_updateState();
		if (this.inRecipeDetail) {
			return;
		}

		this.emitter.publish('card:remove', this.ingredient);
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
		const handler = (event, payload) => {};
		this.subscription = appStore
			.subscribe(state => {
				const inList = state.shoppingList.some(
					i => i.id === this.ingredient.id
				);
				if (this.icon) {
					this.icon.setToggled(inList);
				}
			}, 'shoppingList')
			.immediate();
	}

	/**
	 *
	 * @returns {HTMLElement}
	 */
	buildEl() {
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

	async removeSelf() {
		if (this._exitPromise) return this._exitPromise;
		this._exitPromise = this.#_animateExit();
		return this._exitPromise;
	}

	#_animateExit() {
		const element = this.el;
		const LEAVING_CLASS = 'ingredient-mini-card--leaving';
		const FALLBACK_EXTRA_MS = 50; // small buffer on top of computed duration
		const PROPERTY_TRIGGER = new Set(['opacity', 'transform']); // adjust to your CSS
		return new Promise(resolve => {
			let finished = false;
			const finish = () => {
				if (finished) return;
				finished = true;

				if (this._exitFallbackTimer) {
					clearTimeout(this._exitFallbackTimer);
					this._exitFallbackTimer = undefined;
				}
				resolve();
			};

			const styles = getComputedStyle(element);
			const totalMs =
				parseTimeList(styles.transitionDelay) +
				parseTimeList(styles.transitionDuration);

			const start = () => {
				element.addEventListener('transitionend', onEnd, { once: true });
				if (totalMs === 0) {
					element.classList.add(LEAVING_CLASS);

					requestAnimationFrame(finish);
					return;
				}
				element.classList.add(LEAVING_CLASS);
				this._exitFallbackTimer = window.setTimeout(
					finish,
					totalMs + FALLBACK_EXTRA_MS
				);
			};

			/**
			 *
			 * @param {TransitionEvent} e
			 */
			const onEnd = e => {
				if (e.target !== element) return;
				if (!PROPERTY_TRIGGER.size || PROPERTY_TRIGGER.has(e.propertyName)) {
					element.removeEventListener('transitionend', onEnd);
					finish();
				}
			};
			requestAnimationFrame(start);
		});

		function parseTimeList(value) {
			// Handles lists like "200ms, 150ms" or "0.2s, 0.15s"
			return value
				.split(',')
				.map(s => s.trim())
				.map(s => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000))
				.reduce((a, b) => Math.max(a, b), 0); // use the longest component
		}
	}

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
		if (this._exitFallbackTimer) {
			clearTimeout(this._exitFallbackTimer);
			this._exitFallbackTimer = undefined;
		}
		this.el.innerHTML = '';
	}
}
