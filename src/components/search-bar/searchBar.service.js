/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCard
 * @typedef {import('../../types/componentTypes.js').RecipeGridParams} GridParams
 */

import { SpoonacularClient } from '../../api/client.js';
import { SearchBar } from './searchBar.controller.js';

/**
 * @typedef {object} SearchService
 * @property {function({params: Record<string, any>}): void} invokeRouter
 */

/**
 *
 * @param {*} opts
 * @returns {SearchService}
 */
export function createSearchService(opts = {}) {
	const client = new SpoonacularClient();
	/**
	 * @type {SearchService}
	 */
	const service = {
		invokeRouter: params => {}
	};

	return service;
}
