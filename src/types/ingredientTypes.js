export {};

/**
 * @typedef {object} NutrientInfo
 * @property {string} [name]
 * @property {number} [amount]
 * @property {string} [unit]
 * @property {number} [percentOfDailyNeeds]
 */

/**
 * @typedef {object} IngredientInformation
 * @property {number} [id]
 * @property {string} [original]
 * @property {string} [originalName]
 * @property {string} [aisle]
 * @property {string} [image]
 * @property {NutrientInfo[]} [nutrition]
 * @property {string[]} [categoryPath]
 */

/**
 * @typedef {object} IngredientResultCard
 * @property {number} [id]
 * @property {string} [name]
 * @property {string} [image]
 * @property {number} [linkedRecipeId]
 * @property {string} [linkedRecipe]
 */
