import { renderRecipeCard } from '../../templates/recipeCard.js';

export class RecipeCard {
	/**
	 *
	 * @param {Object} recipe
	 * @param {HTMLElement} parentElement
	 */
	constructor(recipe, parentElement) {
		/** @type {Object} */ this.recipe = recipe;
		/** @type {HTMLElement} */ this.parent = parentElement;
	}

	render() {
		this.parent.innerHTML = renderRecipeCard(this.recipe);
	}

	destroy() {
		this.parent.innerHTML = '';
	}
}
