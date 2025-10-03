/**
 * @typedef {import('../config/endpoints.js').EndpointKey} EndpointKey
 * @typedef {import('../types/recipeTypes.js').RecipeFull} RecipeFull
 */

// import { ENV } from '../config/env.js';
import { ENV } from '../env.js';
import { SPOONACULAR_ENDPOINTS, buildEndpoint } from '../config/endpoints.js';

/**
 * @class SpoonacularClient
 * Handles API calls to the Spoonacular REST API
 */
export class SpoonacularClient {
	constructor() {
		if (!ENV.API_URL) {
			throw new Error(
				'[MISSING ENV] - Missing API config please consult README "Troubleshooting" section.'
			);
		}
		this.apiUrl = ENV.API_URL;
	}

	/**
	 *
	 * @returns
	 */
	async getTestApiRecipes(single = false) {
		const queryParams = { test: true };
		const endpoint = single ? '/recipes/test-random' : '/recipes/test';
		try {
			const responseJson = await this._fetch(endpoint, queryParams);
			return responseJson;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @returns {Promise<RecipeFull>}
	 */
	async getRandomRecipe() {
		return await this.getTestApiRecipes(true);
		const key = /** @type {EndpointKey} */ ('getRandomRecipes');
		const endpoint = this._buildEndpointWithParameters(key);
		const responseJson = await this._fetch(endpoint);
		return responseJson;
	}

	/**
	 *
	 * @param {string[]} searchTerms
	 * @param {Object} params
	 * @returns
	 */
	async searchRecipes(searchTerms, params = {}) {
		// const urlParams =
		const searchTermStr = searchTerms.join(',');
		const queryParams = {
			query: searchTermStr,
			...params
		};
		const key = /** @type {EndpointKey} */ ('searchRecipes');
		const endpoint = this._buildEndpointWithParameters(key);
		const responseJson = await this._fetch(endpoint, queryParams);
		return responseJson;
	}

	/**
	 *
	 * @param {string[]} ingredients
	 * @param {number} recipes - Max num of recipes to return between 1 and 100
	 * @param {boolean} [ignorePantry]
	 */
	async findByIngredients(ingredients, recipes, ignorePantry = true) {
		const searchString = this._buildSearchString(ingredients);
		const queryParams = {
			ingredients: searchString,
			number: recipes.toString()
		};
		const key = /** @type {EndpointKey} */ ('searchRecipesByIngredients');
		const endpoint = this._buildEndpointWithParameters(key);

		const responseJson = await this._fetch(endpoint, queryParams);
		return responseJson;
	}

	/**
	 *
	 * @param {number} id
	 * @returns {Promise<RecipeFull>}
	 */
	async getRecipeInformation(id) {
		const endpoint = this._buildEndpointWithParameters('getRecipeInformation', {
			id
		});

		console.log('Endpoint for testing: ', endpoint);
		// return;

		const responseJson = await this._fetch(endpoint);
		return responseJson;
	}

	async getRecipeSummary(id) {
		const endpoint = this._buildEndpointWithParameters('summarizeRecipe', {
			id
		});
		const responseJson = await this._fetch(endpoint);
		return responseJson;
	}

	async searchIngredients(query) {}
	/**
	 *
	 * @param {string} endpoint - Spoonacular path, e.g. "/recipes/complexSearch"
	 * @param {Object} params - Query Params as key-value pairs
	 * @param {number} [retries=0]
	 * @returns {Promise<any>}
	 */
	async _fetch(endpoint, params = {}, retries = 0) {
		const url = this._buildUrl(endpoint, params);

		try {
			const response = await fetch(url);
			if (!response.ok) {
				if (retries > 0) {
					console.warn(`[RETRYING] ${url} (${retries} retries remaining)`);
					await this._delay();
					return await this._fetch(endpoint, retries - 1, params);
				}
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
	 * @private
	 * @param {number} [ms=500] - Milliseconds to wait (Half a second default)
	 * @returns
	 */
	_delay(ms = 500) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 *
	 * @param {string[]} ingredients
	 */
	_buildSearchString(ingredients) {
		return ingredients.map(ingredient => ingredient.trim()).join(',+');
	}

	/**
	 * @param {keyof typeof SPOONACULAR_ENDPOINTS | 'test'} path - Endpoint key
	 * @param {Record<string, string | number>} [params={}] - Path replacements
	 * @returns {string} Full endpoint path with injected values
	 */
	_buildEndpointWithParameters(path, params = {}) {
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
			...params
		}).toString();

		return `${this.apiUrl}${endpoint}?${query}`;
	}
}
