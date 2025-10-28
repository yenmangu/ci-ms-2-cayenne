export {};

/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 * @typedef {import("./recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import("./recipeTypes.js").Measures} Measures
 * @typedef {import('./ingredientTypes.js').IngredientResultCard} ShoppingListItem
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
 * @typedef {object} ShoppingListItemOld
 * @property {number} [linkedRecipeId]
 * @property {string} [linkedRecipe]
 * @property {number} [id]
 * @property {string} [image]
 * @property {string} [consistency]
 * @property {string} [nameClean]
 * @property {string} aisle
 * @property {number}amount
 * @property {Measures} measures
 * @property {string[]} meta
 * @property {string} name
 * @property {string} original
 * @property {string} originalName
 * @property {string} unit
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
 * @property {ShoppingListItem[]} [shoppingList]
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
 * @property {ShoppingListItem[]} [shoppingList]
 *
 */

/**
 * Type definition for the allowed persistable state
 *
 * @typedef {object} PersistableState
 * @property {RecipeCard[]} [likedRecipes]
 * @property {UnitLocale} [unitLocale]
 * @property {ShoppingListItem[]} [shoppingList]
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
