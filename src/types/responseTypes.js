export {};

/**
 * @typedef {import("./errorTypes.js").ErrorMeta} ErrorMeta
 */

/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 * @typedef {object} RawSearchResponse
 * @property {RecipeCard[]} [results]
 * @property {number} [offset] - 'Offset' specified in query
 * @property {number} [number] - 'Number' specified in query
 * @property {number} [totalResults] - Number of matching recipes available
 * // NOTE: May include additional properties of any key/value
 */

/**
 * @typedef {{[key:string]: any}} AdditionalProps
 */

/**
 * @typedef {{
 * 	results?: RecipeCard[],
 * 	offset?: number,
 * 	number?: number,
 * 	totalResults?: number,
 * 	[key:string]: any
 * }} SearchResponse
 */

/**
 * @typedef {object} FetchResult
 * @property {unknown} data
 * @property {ErrorMeta} meta
 */
