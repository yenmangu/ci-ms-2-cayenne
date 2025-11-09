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
 * @property {number}[counter]
 *
 */
import { getClient } from '../../api/client.singleton.js';
import { appStore } from '../../appStore.js';
import { createErrorPublishing } from '../../error/pipe/publishFactory.js';
import { getCurrentRouteScope } from '../../error/util/errorScope.js';

/**
 *
 * @param {*} opts
 */

export const createLandingService = opts => {
	const client = getClient();

	/** @type {LandingService} */
	const service = {
		client,
		counter: 0,
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
		/** @type {RecipeFull} */
		fetchedRecipe: null,

		recipeCard: null,
		recipeId: null,
		/**
		 *
		 * @param {RecipeFull | SingleRecipeEnvelope} input
		 * @returns {RecipeFull}
		 */
		toRecipeCard(input) {
			const recipe = 'recipes' in input ? input.recipes[0] : input;
			return recipe;
		},

		updateStoreRandomRecipe: async () => {
			service.counter++;

			try {
				const fetchResult = await client.getRandomRecipe();
				if (!fetchResult) return;
				const { data } = fetchResult;
				const recipe = /** @type {RecipeFull} */ (data);
				appStore.setState({ currentRandom: recipe });
			} catch (error) {
				// throw error;
				createErrorPublishing().routeError(
					appStore,
					getCurrentRouteScope(),
					error,
					undefined,
					undefined,
					{}
				);
			}
		}
	};

	return service;
};
