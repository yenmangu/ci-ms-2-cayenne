/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 * Parameters passed to all domain-level components
 * I will extend this union as new domain components are added
 *
 * @typedef {object} ComponentProps
 * @property {import("./recipeTypes.js").RecipeCard[]} [recipes]
 * @property {string} [recipeId]
 * @property {Record<string, string> | {}} [filters]
 * @property {Record<string, string> | {}} [queryParams]
 */

/**
 * Minimum interface for domain level components
 * All routed components must implement this
 *
 * @typedef {object} RenderableComponent
 * @property {function(): void} render
 */

/**
 * Constructor signature for a domain-level routed component
 *
 * @typedef {new
 * 	(
 * 		appRoot: HTMLElement,
 * 		params?: ComponentProps,
 * 		pathName?: string
 * 	) => RenderableComponent
 * }
 */

/**
 * @typedef {object} RecipeGridParams
 * @property {RecipeCard[]} recipes
 */

/**
 * @typedef {object} RecipeDetailParams
 * @property {string} RecipeId
 */

/**
 * Add new domain level params here
 */

export {};
