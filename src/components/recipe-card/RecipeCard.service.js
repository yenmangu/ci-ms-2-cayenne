import { appStore } from '../../appStore.js';

/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 *
 * @param {*} opts
 */

export const createCardService = opts => {
	const service = {
		/**
		 *
		 * @param {RecipeCard} recipe
		 */
		onSaveClick: recipe => {
			appStore.toggleLikedrecipe(recipe);
		}
	};
	return service;
};
