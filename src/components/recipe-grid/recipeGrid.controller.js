/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { appStore } from '../../appStore.js';
import { RecipeCard } from '../recipe-card/recipeCard.controller.js';
import * as service from './recipeGrid.service.js';
import {
	getCardWrapperClass as getCardWrapperClassName,
	renderGridContainer,
	renderSkeletonCard
} from './recipeGrid.view.js';
// import { RecipeCard } from "../recipe-card/controller.js";

export class RecipeGrid {
	/**
	 * @param {HTMLElement} appRoot
	 * @param {RecipeCardObject[]} recipes
	 * @param {object} [opts={}]
	 * @param {string[]} [opts.search=[]]
	 * @param {string} [opts.title]
	 */
	constructor(appRoot, recipes, opts = {}) {
		this.appRoot = appRoot;
		this.service = service.createGridService();

		/** @type {RecipeCardObject[]} */
		this.recipes = recipes;

		this.loading = false;

		/** @type {Object} */
		this.opts = opts;

		/** @type {string} */
		this.title = opts?.title;

		/** @type {string[]} */
		this.search = opts.search ?? [];

		/** @type {RecipeCard[]} */
		this.cardInstances = [];

		this.grid = null;

		this.subscription = appStore
			.subscribe(state => {
				if (state && state.route) {
					this.title = state.route.title || '';
				}
			}, 'route')
			.immediate();
	}

	/**
	 *
	 * @param {number} id
	 * @returns {RecipeCard | undefined}
	 */
	_preRenderCardInstances() {
		this.cardInstances = this.recipes.map(recipe => {
			const wrapper = document.createElement('div');
			wrapper.className = getCardWrapperClassName();
			const card = new RecipeCard(wrapper, recipe);
			// card.render()
			return card;
		});
	}

	/**
	 *
	 * @param {HTMLElement} cardEl
	 * @param {()=> void} onDone
	 */
	_removeCardWithAnimation(cardEl, onDone) {
		cardEl.classList.add('recipe-card--leaving');

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

	_renderInstances() {
		this.cardInstances.forEach(card => {
			card.render();
			this.grid.appendChild(card.parent);
		});
	}

	/**
	 * Renders the individual recipe cards
	 *
	 * @private
	 */
	_renderRecipeCards() {
		this.cardInstances = this.recipes.map(recipe => {
			const wrapper = document.createElement('div');
			wrapper.className = getCardWrapperClassName();
			const card = new RecipeCard(wrapper, recipe);
			card.render();
			this.grid.appendChild(wrapper);
			return card;
		});
	}

	/**
	 * Render skeleton placeholders whilst loading
	 */
	_renderSkeletons() {
		const skeletonCount = 6;

		for (let i = 0; i < skeletonCount; i++) {
			const wrapper = document.createElement('div');
			wrapper.className = getCardWrapperClassName();
			wrapper.innerHTML = renderSkeletonCard();
			this.grid.appendChild(wrapper);
		}
	}

	/**
	 *
	 * @param {Object} filters
	 * @returns {RecipeCardObject[]}
	 */
	applyFilters(filters) {
		const keys = Object.keys(filters);
		if (keys.length === 0) return this.recipes;

		return this.recipes.filter(recipe => {
			return keys.every(key => {
				const value = filters[key];
				const recipeVal = recipe[key];

				if (Array.isArray(recipeVal)) {
					return recipeVal.includes(value);
				} else {
					return recipeVal === value;
				}
			});
		});
	}

	destroy() {
		this.appRoot.innerHTML = '';
		this.cardInstances = [];
		this.grid = null;
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}

	/**
	 *
	 * @param {()=> boolean | null} [fn]
	 * @param {Object} [filters]
	 */
	filter(fn = null, filters = {}) {
		let filtered = /** @type {RecipeCardObject[]} */ ([]);
		if (typeof fn === 'function') {
			filtered = this.recipes.filter(fn);
		} else {
			filtered = this.applyFilters(filters);
		}

		this.updateCards(filtered);
	}

	getCardById(id) {
		return this.cardInstances.find(card => card.recipe.id === id);
	}

	/**
	 *
	 * @param {RecipeCardObject[]} updatedRecipes
	 * @param {boolean} animate
	 */
	onGridUpdate(updatedRecipes, animate = false) {
		if (!animate) {
			this.updateCards(updatedRecipes);
			this.render();
		} else {
			const toRemoveIds = this.recipes
				.filter(prev => !updatedRecipes.some(next => next.id === prev.id))
				.map(r => r.id);
			toRemoveIds.forEach(id => {
				const cardInstance = this.getCardById(id);
				if (cardInstance && cardInstance.parent)
					this._removeCardWithAnimation(cardInstance.parent, () => {
						this.updateCards(updatedRecipes);
					});
			});
		}
	}

	/**
	 * Renders the grid and
	 * either skeletons if loading === true,
	 * or live recipe cards if loading === false
	 *
	 * @returns {void}
	 */
	render() {
		this.appRoot.innerHTML = renderGridContainer(this.title, this.search);
		this.grid = document.getElementById('recipeGrid');
		if (!this.grid) {
			throw new Error(`[Recipe Grid Controller] Recipe grid not found`);
		}

		if (this.loading) {
			this._renderSkeletons();
			return;
		} else {
			this._renderRecipeCards();
		}
	}

	/**
	 * Set the loading state
	 *
	 * @param {boolean} isLoading
	 */
	setLoading(isLoading) {
		this.loading = isLoading;
	}

	/**
	 *
	 * @param {string | number} field
	 */
	sortBy(field) {
		const sorted = [...this.recipes].sort((a, b) => {
			const aVal = a[field];
			const bVal = b[field];

			if (typeof aVal === 'string') {
				return aVal.localeCompare(bVal);
			} else {
				return aVal - bVal;
			}
		});

		this.updateCards(sorted);
	}

	/**
	 *
	 * @param {RecipeCardObject[]} updatedRecipes
	 */
	updateCards(updatedRecipes) {
		this.recipes = updatedRecipes;
		this.render();
	}
}
