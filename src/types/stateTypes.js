export {};

/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 * @typedef {import("./recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import("./recipeTypes.js").Measures} Measures
 * @typedef {import('./ingredientTypes.js').IngredientResultCard} ShoppingListItem
 * @typedef {import("./routerTypes.js").RouteEntry} RouteEntry
 * @typedef {import("./errorTypes.js").ErrorType} ErrorType
 * @typedef {import("./errorTypes.js").ErrorDetails} ErrorDetails
 *
 */

/**
 * @typedef {'global'|
 * `route:${string}`|
 * `section:${string}`|
 * 'router'|
 * 'domain'|
 * 'component'|
 * 'network'
 * } ErrorScope
 *
 * @typedef {import("./errorTypes.js").ErrorCommand} ErrorCommand
 */

/**
 * @typedef {object} ErrorMeta
 * @property {ErrorCommand} [cmd]
 * @property {string} [endpoint]
 * @property {string} [urlAbs]
 * @property {Record<string, any>} [params]
 * @property {RequestInit} [opts]
 * @property {ErrorMeta[]} [metas]
 * @property {'live'|'test'|'absolute'|'refetch'} [from]
 * @property {number} [status]
 * @property {boolean}[isDev]
 *
 * @typedef {ErrorMeta[]} ErrorMetas
 */

/**
 * @typedef {'error'|'warning'|'info'} Severity
 */

/**
 * Serialisable error store in the state (no function)
 * @typedef {object} ErrorEntry
 * @property {string} id
 * @property {ErrorType} type
 * @property {string} code
 * @property {string} userMessage
 * @property {number} [status]
 * @property {string} [message]
 * @property {ErrorScope} scope
 * @property {Severity} [severity]
 * @property {boolean} [sticky]
 * @property {number} ts
 * @property {ErrorMeta} [meta]
 * @property {ErrorDetails} [details]
 * @property {ErrorScope} [scope]
 * @property {boolean} [retry]
 */

/**
 * Error slice state (dedupe is runtime only, not persisted)
 * @typedef {object} ErrorState
 * @property {ErrorEntry[]} items
 * @property {Set<string>} dedupe
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
 * @property {boolean} [devMode]
 * @property {boolean} [isInitial]
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
 * @property {ShoppingListItem[]} [shoppingList]
 * @property {ErrorEntry[]} [errors]
 * @property {boolean} [useLive] - flag to indicate if app should use live
 *
 */
/**
 * @typedef {object} PartialAppState
 * @property {boolean} [devMode]
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
 * @property {ShoppingListItem[]} [shoppingList]
 * @property {ErrorEntry[]} [errors]
 * @property {boolean} [useLive] - flag to indicate if app should use live

 *
 */

/**
 * Type definition for the allowed persistable state
 *
 * @typedef {object} PersistableState
 * @property {RecipeCard[]} [likedRecipes]
 * @property {UnitLocale} [unitLocale]
 * @property {ShoppingListItem[]} [shoppingList]
 * @property {boolean} [useLive]
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
 *  'errors'|
 *  'useLive'
 * } StateKey
 */

/**
 * @typedef {ReturnType<import('../event/store.js').createStateStore>} AppStore
 */

/**
 * @typedef {{
 *   setState: (updates: PartialAppState, opts?: {global?: boolean}) => void,
 *   getState: () => PartialAppState,
 *   subscribe: AppStore['subscribe'],
 *   dispatch: AppStore['dispatch'],
 *   resetState: AppStore['resetState']
 * }} ThunkContext
 */

/** @typedef {(ctx: ThunkContext) => any} StoreAction */
