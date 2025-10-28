/**
 * @typedef {import("../types/stateTypes.js").ShoppingListItem} ShoppingListItem
 * @typedef {import('../types/ingredientTypes.js').IngredientResultCard} Ingredient
 * @typedef {import('../types/recipeTypes.js').ExtendedIngredient} ExtendedIngredient
 */

/**
 *
 * @param {string} path
 * @param {number} size
 * @returns {string}
 */
const imageBase = (path, size) => {
	if (!path) {
		return `./assets/images/placeholders/ingredient-placeholder.png`;
	}
	return `https://img.spoonacular.com/ingredients_${size.toString()}x${size.toString()}/${path.trim()}`;
};

/**
 *
 * @param {ShoppingListItem[]} ingredients
 * @param {number} [size=100]
 * @returns {ShoppingListItem[]}
 */
export function mapFullImageUrl(ingredients, size = 100) {
	return ingredients.map(v => {
		return { ...v, image: imageBase(v.image, size) };
	});
}
