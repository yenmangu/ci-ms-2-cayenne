/**
 * A function that handles a route and renders content into the app container
 * @callback RouteHandler
 * @param {HTMLElement} appRoot - The DOM node where the component should render
 * @param {string} [pathName]
 * @param {Record<string, string>} [params] - Route parameters extracted from the URL
 */

/**
 * Represents a route entry in the route map
 * @typedef {Object} RouteEntry
 * @property {RouteHandler} handler - Function called when route is matched
 * @property {boolean} [requiresAuth] - Whether the route requires login
 * @property {string} [title] - Optional title to set for the page
 */

/**
 * A map of path strings to route entries
 * @typedef {Record<string, RouteEntry>} RouteMap
 */

export {};
