/**
 * @typedef {import("../types/recipeTypes.js").RecipeFull} RecipeFull
 */

const IMAGE_PLACEHOLDER =
	'../../assets/images/placeholders/meal-placeholder.png';

/**
 *
 * @param {RecipeFull} recipe
 * @returns {Promise<RecipeFull>}
 */
export async function addImagePlaceholder(recipe) {
	const imageResponse = await fetch(recipe?.image);
	if (!imageResponse.ok) {
	}
	return {
		image: imageResponse.ok ? recipe.image : IMAGE_PLACEHOLDER,
		...recipe
	};
}
