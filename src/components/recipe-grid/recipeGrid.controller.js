/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { RecipeCard } from '../recipe-card/recipeCard.controller.js';
import {
	getCardWrapperClass as getCardWrapperClassName,
	renderGridContainer,
	renderSkeletonCard
} from './recipeGrid.view.js';
// import { RecipeCard } from "../recipe-card/controller.js";

export class RecipeGrid {
	/**
	 * @param {HTMLElement} app
	 * @param {RecipeCardObject[]} recipes
	 * @param {Object} opts
	 */
	constructor(app, recipes, opts = {}) {
		this.app = app;
		/** @type {RecipeCardObject[]} */
		this.recipes = recipes;
		this.loading = false;

		/** @type {Object} */
		this.opts = opts;

		/** @type {RecipeCard[]} */
		this.cardInstances = [];

		this.grid = null;
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
	 * Renders the grid and
	 * either skeletons if loading === true,
	 * or live recipe cards if loading === false
	 *
	 * @returns {void}
	 */
	render() {
		this.app.innerHTML = renderGridContainer();
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
	 *
	 * @param {RecipeCardObject[]} updatedRecipes
	 */
	updateCards(updatedRecipes) {
		this.recipes = updatedRecipes;
		this.render();
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

	/**
	 *
	 * @param {number} id
	 * @returns {RecipeCard | undefined}
	 */
	getCardById(id) {
		return this.cardInstances.find(card => card.recipe.id === id);
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
			const card = new RecipeCard(recipe, wrapper);
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

	destroy() {
		this.app.innerHTML = '';
		this.cardInstances = [];
		this.grid = null;
	}
}
