/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').SingleRecipeEnvelope} SingleRecipeEnvelope
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCardObject
 * @typedef {import('../../api/client.js').SpoonacularClient} SpoonacularClient
 */

/**
 * @typedef {object} LandingService
 * @property {SpoonacularClient} client
 * @property {RecipeFull} fetchedRecipe
 * @property {number} recipeId
 * @property {RecipeCardObject} recipeCard
 * @property {function(): void} updateStoreRandomRecipe
 * @property {function(RecipeFull): RecipeCardObject} extractCard
 * @property {function(RecipeFull | SingleRecipeEnvelope): RecipeFull} toRecipeCard
 *
 */
import { getClient } from '../../api/client.singleton.js';
import { appStore } from '../../appStore.js';

/**
 *
 * @param {*} opts
 */

export const createLandingService = opts => {
	const client = getClient();

	/** @type {LandingService} */
	const service = {
		client,
		/** @type {RecipeFull} */ fetchedRecipe: null,
		recipeId: null,
		recipeCard: null,

		/**
		 *
		 * @param {RecipeFull} recipe
		 * @returns {RecipeCardObject}
		 */
		extractCard: recipe => {
			recipe = service.toRecipeCard(recipe);
			if (recipe.id === undefined) throw new Error('Error recipe not found');
			return {
				id: recipe.id,
				image: recipe.image ?? 'Image Not Found',
				imageType: recipe.imageType ?? 'Image not found',
				title: recipe.title
			};
		},
		updateStoreRandomRecipe: async () => {
			const recipe = await client.getRandomRecipe();
			appStore.setState({ currentRandom: recipe });
		},

		/**
		 *
		 * @param {RecipeFull | SingleRecipeEnvelope} input
		 * @returns {RecipeFull}
		 */
		toRecipeCard(input) {
			const recipe = 'recipes' in input ? input.recipes[0] : input;
			return recipe;
		}
	};

	return service;
};
