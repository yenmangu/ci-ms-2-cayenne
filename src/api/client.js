/**
 * @typedef {import('../config/endpoints.js').EndpointKey} EndpointKey
 */

import { ENV } from '../config/env.js';
import { SPOONACULAR_ENDPOINTS, buildEndpoint } from '../config/endpoints.js';

/**
 * @class SpoonacularClient
 * Handles API calls to the Spoonacular REST API
 */
export class SpoonacularClient {
	constructor() {
		if (!ENV.API_BASE_URL || !ENV.API_KEY) {
			throw new Error(
				'[MISSING ENV] - Missing API config please consult README "Troubleshooting" section.'
			);
		}
		this.apiKey = ENV.API_KEY;
		this.baseUrl = ENV.API_BASE_URL;
	}

	async searchRecipes(query) {}

	async searchIngredients(query) {}

	/**
	 *
	 * @param {string} endpoint - Spoonacular path, e.g. "/recipes/complexSearch"
	 * @param {Object} params - Query Params as key-value pairs
	 * @returns {Promise<any>}
	 */
	async _fetch(endpoint, params = {}) {
		const url = this._buildUrl(endpoint, params);

		try {
			const response = await fetch(url);
			if (!response.ok) {
				const message = `[API ERROR] ${response.status} ${response.statusText}`;
				throw new Error(message);
			}
			return await response.json();
		} catch (error) {
			console.error(`[FETCH FAIL] ${url}`, error);
			throw error;
		}
	}

	/**
	 *
	 * @param {string[]} ingredients
	 * @param {number} recipes - Max num of recipes to return between 1 and 100
	 * @param {boolean} [ignorePantry]
	 */
	async findByIngredients(ingredients, recipes, ignorePantry = true) {
		const searchString = this._buildSearchString(ingredients);
		const query = {
			ingredients: searchString,
			number: recipes.toString()
		};
		const key = /** @type {EndpointKey} */ ('searchRecipesByIngredients');
		const endpoint = this._buildEndpoint(key);

		const responseJson = await this._fetch(endpoint, query);
		return responseJson;
	}

	/**
	 *
	 * @param {string[]} ingredients
	 */
	_buildSearchString(ingredients) {
		return ingredients.map(ingredient => ingredient.trim()).join(',+');
	}

	/**
	 * @param {keyof typeof SPOONACULAR_ENDPOINTS} path - Endpoint key
	 * @param {Record<string, string | number>} [params={}] - Path replacements
	 * @returns {string} Full endpoint path with injected values
	 */
	_buildEndpoint(path, params = {}) {
		const foundPath = SPOONACULAR_ENDPOINTS[path];
		if (foundPath) {
			return buildEndpoint(foundPath, params);
		} else {
			throw new Error(`[API_ERROR]: Unknown endpoint key: "${path}"`);
		}
	}

	/**
	 *
	 * @param {string} endpoint - Spoonacular path, e.g. "/recipes/complexSearch"
	 * @param {Object} [params={}] - Query Params as key-value pairs
	 * @returns {string} Full endpoint
	 */
	_buildUrl(endpoint, params = {}) {
		const query = new URLSearchParams({
			apiKey: this.apiKey,
			...params
		}).toString();

		return `${this.baseUrl}${endpoint}?${query}`;
	}
}
