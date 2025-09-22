export {};

/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 * @typedef {import("./recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import(
 * 		"../components/error-message/errorMessage.controller.js"
 * 	).ErrorMessageConfig} ErrorConfig
 *
 */

/**
 * @typedef {'us'|'metric'} MeasureSystem
 * @typedef {'unitShort'|'unitLong'} UnitLength
 */

/**
 * @typedef {object} AppState
 * @property {MeasureSystem} measureSystem - User's preferred units
 * @property {UnitLength} unitLength - User's preferred unit length
 * @property {RecipeCard[]} recipeResults - Results from last recipe search
 * @property {RecipeFull | null} currentRecipe - Currently selected/loaded recipe
 * @property {string} [searchQuery] - Current search query
 * @property {object} [activeFilters] - Structured object for filters (diets, cook time etc)
 * @property {boolean} [loading] - Loading flag
 * @property {ErrorConfig|null} [error] - Current error, if any
 *
 */
