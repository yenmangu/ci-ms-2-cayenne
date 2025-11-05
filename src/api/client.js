/**
 * @typedef {import('../config/endpoints.js').EndpointKey} EndpointKey
 * @typedef {import('../types/recipeTypes.js').RecipeFull} RecipeFull
 *
 * @typedef {import('../types/stateTypes.js').ErrorMeta} ErrorMeta
 */

// import { ENV } from '../config/env.js';
import { appStore } from '../appStore.js';
import { SPOONACULAR_ENDPOINTS, buildEndpoint } from '../config/endpoints.js';
import { ENV } from '../env.js';
import { safeText } from '../util/safeText.js';

/**
 * @class SpoonacularClient
 * Handles API calls to the Spoonacular REST API
 */
export class SpoonacularClient {
	#sub = null;
	constructor() {
		if (!ENV.API_URL) {
			throw new Error(
				'[MISSING ENV] - Missing API config please consult README "Troubleshooting" section.'
			);
		}
		this.useLive = true;
		this.apiUrl = ENV.API_URL;
		this.#sub = appStore.subscribe(state => {
			this.useLive = state.useLive;
		}, 'useLive');
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
	 * @param {string[]} ingredients
	 */
	_buildSearchString(ingredients) {
		return ingredients.map(ingredient => ingredient.trim()).join(',+');
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
		const base = this.apiUrl.replace(/\/$/, '');
		return query ? `${base}${endpoint}?${query}` : `${base}${endpoint}`;
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
	 * @param {string} endpoint - Spoonacular path, e.g. "/recipes/complexSearch"
	 * @param {Record<string, any>} params - Query Params as key-value pairs
	 * @param {number} [retries=0]
	 * @param {RequestInit} [opts]
	 * @returns {Promise<any>}
	 */
	async _fetch(endpoint, params = {}, retries = 0, opts = {}) {
		const url = this._buildUrl(endpoint, params);

		try {
			const response = await fetch(url, opts);
			if (!response.ok) {
				if (response.status === 402) {
					console.log('Hit paywalll');
				}
				if (retries > 0) {
					console.warn(`[RETRYING] ${url} (${retries} retries remaining)`);
					await this._delay();

					return await this._fetch(endpoint, params, retries - 1, opts);
				}
				const detail = await safeText(response);
				const err = new Error(
					`[API ERROR] ${response.status} ${response.statusText}${
						detail ? ` - ${detail}` : ''
					}`
				);
				/** @type {any} */ (err).status = response.status;
				throw err;
			}
			return await response.json();
		} catch (error) {
			console.error(`[FETCH FAIL] ${url}`, error);
			throw error;
		}
	}

	/**
	 * Absolute URL variant (used when meta.url already includes full path+query).
	 * @param {string} url
	 * @param {RequestInit} [opts]
	 */
	async _fetchAbsolute(url, opts) {
		try {
			const res = await fetch(url, opts);
			if (!res.ok) {
				const detail = await safeText(res);
				const err = new Error(
					`[API ERROR] ${res.status} ${res.statusText}${
						detail ? ` - ${detail}` : ''
					}`
				);
				/** @type {any} */ (err).status = res.status;
				throw err;
			}
			return await res.json();
		} catch (e) {
			console.error('[FETCH ABS FAIL]', url, e);
			throw e;
		}
	}

	/**
	 *
	 * @param {string[]} ingredients
	 * @param {number} recipes - Max num of recipes to return between 1 and 100
	 */
	async findByIngredients(ingredients, recipes) {
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
	 * @returns {Promise<RecipeFull>}
	 */
	async getRandomRecipe() {
		if (this.useLive) {
			const key = /** @type {EndpointKey} */ ('getRandomRecipes');
			const endpoint = this._buildEndpointWithParameters(key);
			const responseJson = await this._fetch(endpoint);
			return responseJson;
		} else {
			return await this.getTestApiRecipes(true);
		}
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
	 *
	 * @param {EndpointKey | string} endpointKeyOrPath
	 * @param {Record<string, any>} [params={}]
	 * @param {RequestInit} [opts={}]
	 */
	async refetch(endpointKeyOrPath, params = {}, opts = {}) {
		const endpoint =
			endpointKeyOrPath in SPOONACULAR_ENDPOINTS
				? this._buildEndpointWithParameters(
						/** @type {EndpointKey} */ (endpointKeyOrPath),
						params
				  )
				: /** @type {string} */ (endpointKeyOrPath);
		return this._fetch(endpoint, params, 0, opts);
	}

	/**
	 *
	 * @param {ErrorMeta} meta
	 * @returns {Promise<any>}
	 */
	async refetchFromMeta(meta) {
		if (meta?.url) {
			return this._fetchAbsolute(meta.url, meta.opts);
		}
		if (meta?.endpoint) {
			return this.refetch(meta.endpoint, meta.params, meta.opts);
		}
		throw new Error('[REFETCH] Missing url/endpoint in meta');
	}

	async searchIngredients(query) {}

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
}
