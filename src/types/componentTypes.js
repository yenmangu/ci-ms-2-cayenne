/**
 * @typedef {import("./recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 * Parameters passed to all domain-level components
 * I will extend this union as new domain components are added
 *
 * @typedef {object} ComponentProps
 * @property {import("./recipeTypes.js").RecipeCard[]} [recipes]
 * @property {number} [recipeId]
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
 * Minimal shape of every component instance.
 * @typedef {{render(): void, destroy(): void}} ComponentLike
 */

/**
 * Generic constructor type returning T.
 * @template T
 * @typedef {new (appRoot: HTMLElement, pathName?: string, params?: object) => T} Ctor
 */

/**
 * @template T extents ComponentLike
 */

/**
 * @typedef {object} RecipeGridParams
 * @property {RecipeCard[]} recipes
 */

/**
 * @typedef {object} RecipeDetailParams
 * @property {number} recipeId
 */

/**
 * Add new domain level params here
 */

export {};
