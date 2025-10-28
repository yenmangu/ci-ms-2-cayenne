export {};

/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 * @typedef {import("./recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import("./recipeTypes.js").ExtendedIngredient} ExtendedIngredient
 * @typedef {import('./ingredientTypes.js').IngredientResultCard} IngredientResultCard
 * @typedef {import("./routerTypes.js").RouteEntry} RouteEntry
 * @typedef {import(
 * 		"../components/error-message/errorMessage.controller.js"
 * 	).ErrorMessageConfig} ErrorConfig
 *
 */

/**
 * @typedef {'us'|'metric'} UnitLocale
 * @typedef {'unitShort'|'unitLong'} UnitLength
 * @typedef {'US / Imperial'|'Metric'} UserLocale
 * @typedef {'Short'|'Full'} UserLength
 *
 */

/**
 * @typedef {object} ShoppingListItem
 * @property {number} [id]
 * @property {string} name
 * @property {number} [amount]
 * @property {string} [unit]
 * @property {string} [image]
 * @property {number}[recipeId] - optional to track which recipe the ingredient came from
 */

/**
 * @typedef {object} AppState
 * @property {UnitLocale} unitLocale - User's preferred units
 * @property {UnitLength} unitLength - User's preferred unit length
 * @property {RecipeCard[]} recipeResults - Results from last recipe search
 * @property {RecipeFull | null} currentRecipe - Currently selected/loaded recipe
 * @property {RecipeFull | null} [currentRandom] - Currently selected/loaded recipe
 * @property {string[]} [searchQuery] - Current search query
 * @property {object} [activeFilters] - Structured object for filters (diets, cook time etc)
 * @property {RecipeCard[]} [likedRecipes] - List of user-favourited recipes
 * @property {boolean} [loading] - Loading flag
 * @property {RouteEntry} [route]
 * @property {ErrorConfig|null} [error] - Current error, if any
 * @property {ExtendedIngredient[]} [shoppingList]
 *
 */
/**
 * @typedef {object} PartialAppState
 * @property {boolean} [isInitial]
 * @property {UnitLocale} [unitLocale] - User's preferred units
 * @property {UnitLength} [unitLength] - User's preferred unit length
 * @property {RecipeCard[]} [recipeResults] - Results from last recipe search
 * @property {RecipeFull | null} [currentRecipe] - Currently selected/loaded recipe
 * @property {RecipeFull | null} [currentRandom] - Currently selected/loaded recipe
 * @property {string[]} [searchQuery] - Current search query
 * @property {RecipeCard[]} [likedRecipes] - List of user-favourited recipes
 * @property {object} [activeFilters] - Structured object for filters (diets, cook time etc)
 * @property {boolean} [loading] - Loading flag *
 * @property {RouteEntry} [route]
 * @property {ErrorConfig|null} [error] - Current error, if any
 * @property {ExtendedIngredient[]} [shoppingList]
 *
 */

/**
 * Type definition for the allowed persistable state
 *
 * @typedef {object} PersistableState
 * @property {RecipeCard[]} [likedRecipes]
 * @property {UnitLocale} [unitLocale]
 * @property {ExtendedIngredient[]} [shoppingList]
 */

/**
 * @typedef {'unitLocale' |
 *  'unitLength' |
 *  'recipeResults' |
 *  'currentRecipe' |
 *  'searchQuery' |
 *  'activeFilters' |
 *  'loading' |
 * 	'likedRecipes' |
 * 	'shoppingList' |
 *  'route'|
 *  'error'
 * } StateKey
 */
