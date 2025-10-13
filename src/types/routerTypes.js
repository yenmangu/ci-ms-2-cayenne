/**
 * A function that handles a route and renders content into the app container
 * @callback RouteHandler
 * @param {HTMLElement} appRoot - The DOM node where the component should render
 * @param {string} pathName
 * @param {Record<string, *>} [params] - Route parameters extracted from the URL
 */

/**
 * Represents a route entry in the route map
 * @typedef {object} RouteEntry
 * @property {RouteHandler} handler - Function called when route is matched
 * @property {string} path
 * @property {boolean} [requiresAuth] - Whether the route requires login
 * @property {string} [title] - Optional title to set for the page
 * @property {boolean} [domain] - Flag if component is domain level
 * @property {boolean} [showInNav]
 * @property {string} [icon]
 */

/**
 * A map of path strings to route entries
 * @typedef {Record<string, RouteEntry>} RouteMap
 */

export {};
