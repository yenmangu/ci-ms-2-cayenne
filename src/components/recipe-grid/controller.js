/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { RecipeCard } from '../recipe-card/controller.js';
import { renderGridContainer } from './view.js';
// import { RecipeCard } from "../recipe-card/controller.js";

export class RecipeGrid {
	/**
	 *
	 * @param {RecipeCardObject[]} recipes
	 * @param {Object} opts
	 */
	constructor(recipes, opts = {}) {
		/** @type {RecipeCardObject[]} */
		this.recipes = recipes;

		/** @type {Object} */
		this.opts = opts;

		/** @type {RecipeCard[]} */
		this.cardInstances = [];

		this.container = document.getElementById('app');
		this.grid = null;
	}

	render() {
		this.container.innerHTML = renderGridContainer();
		this.grid = document.getElementById('recipeGrid');
		if (!this.grid) {
			throw new Error(`[Recipe Grid Controller] Recipe grid not found`);
		}

		this.cardInstances = this.recipes.map(recipe => {
			const wrapper = document.createElement('div');
			const card = new RecipeCard(recipe, wrapper);
			card.render();
			this.grid.appendChild(wrapper);
			return card;
		});
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

	destroy() {
		this.container.innerHTML = '';
		this.cardInstances = [];
		this.gird = null;
	}
}
