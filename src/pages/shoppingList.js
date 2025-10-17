/**
 * @typedef {import('../types/routerTypes.js').RouteHandler} Handler
 */

import { ShoppingList } from '../components/shopping-list/shoppingList.controller.js';

/**
 * @type {Handler}
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {object} [params={}]
 * @param {boolean} [params.dev=false]
 */
export function loadShoppingList(appRoot, pathName, params = {}) {
	appRoot.innerHTML = '';
	const shoppingList = new ShoppingList(appRoot, params);
	shoppingList.init();
	return shoppingList || null;
}
