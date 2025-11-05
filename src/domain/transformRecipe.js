/**
 * @typedef {import("../types/recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import("../types/recipeTypes.js").RecipeCard} RecipeCard
 */

const IMAGE_PLACEHOLDER =
	'../../assets/images/placeholders/meal-placeholder.png';

/**
 * Transform a full recipe object into a recipe card object
 *
 * @param {RecipeFull} recipe
 * @returns {RecipeCard}
 */
export function makeRecipeCard(recipe) {
	return {
		id: recipe.id,
		image: recipe.image ?? IMAGE_PLACEHOLDER,
		imageType: recipe.imageType,
		title: recipe.title
	};
}
