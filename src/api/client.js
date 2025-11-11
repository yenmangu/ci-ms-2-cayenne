/**
 * @typedef {import('../config/endpoints.js').EndpointKey} EndpointKey
 * @typedef {import('../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../types/errorTypes.js').ErrorScope} ErrorScope
 * @typedef {import('../types/stateTypes.js').ErrorMeta} ErrorMeta
 */

/**
 * @typedef {import('../types/responseTypes.js').FetchResult} FetchResult
 */

// import { ENV } from '../config/env.js';
import { appStore } from '../appStore.js';
import { SPOONACULAR_ENDPOINTS, buildEndpoint } from '../config/endpoints.js';
import { ENV } from '../env.js';
import { HttpError } from '../error/errors/httpError.js';
import { createErrorPublishing } from '../error/pipe/publishFactory.js';
import { getCurrentRouteScope } from '../error/util/errorScope.js';
import { singleEmitter } from '../event/eventBus.js';
import { isAbsoluteUrl } from '../util/isAbsolute.js';

/**
 * @class SpoonacularClient
 * Handles API calls to the Spoonacular REST API
 */
export class SpoonacularClient {
	#sub = null;
	__reqId = 0;

	constructor() {
		if (!ENV.API_URL) {
			throw new Error(
				'[MISSING ENV] - Missing API config please consult README "Troubleshooting" section.'
			);
		}
		this.useLive = appStore.getState().useLive;
		this.apiUrl = ENV.API_URL;
		this.unsub = null;
		this.quotaEmitter = singleEmitter;
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
	 * @param {number} [id=null]
	 * @returns {string} Full endpoint
	 */
	_buildUrl(endpoint, params = {}, id = null) {
		const query = new URLSearchParams({
			...params
		});
		if (id !== null) {
			query.append('id', id.toString());
		}
		const strQuery = query.toString();
		const base = this.apiUrl.replace(/\/$/, '');
		return query ? `${base}${endpoint}?${strQuery}` : `${base}${endpoint}`;
	}

	/**
	 * Absolute URL variant (used when meta.url already includes full path+query).
	 * @param {string} url
	 * @param {RequestInit} [opts]
	 */
	async _fetchAbsolute(url, opts) {
		return this.#_fetchFromApi(url, opts);
	}

	/**
	 *
	 * @param {string} endpoint
	 * @param {Record<string, any>} params
	 * @returns {{endpoint: string, params: Record<string, any>}}
	 */
	_resolveEndpointForMode(endpoint, params = {}) {
		if (this.useLive) return { endpoint, params };

		if (endpoint === '/recipes/random' || endpoint === '/recipes/test-random') {
			return { endpoint: '/recipes/test-random', params };
		}
		if (endpoint === '/recipes/test') {
			return { endpoint, params };
		}
		const lastPathSeg = endpoint.split('/').pop();
		if (lastPathSeg === 'information' || lastPathSeg === 'summary') {
			const key = /** @type {EndpointKey} */ (lastPathSeg);
			// const
		}

		return { endpoint: '/recipes/test', params: { ...params, test: true } };
	}

	/**
	 *
	 * @param {string[]} ingredients
	 * @param {number} number - Max num of recipes to return between 1 and 100
	 * @returns {Promise<FetchResult>}
	 */
	async findByIngredients(ingredients, number) {
		// const reqId = ++this.__reqId;
		// console.trace('[client.findByIngredients] start', {
		// 	reqId,
		// 	params: { ingredients, number }
		// });

		const searchString = this._buildSearchString(ingredients);
		const queryParams = {
			ingredients: searchString,
			number: number.toString()
		};
		const key = /** @type {EndpointKey} */ ('searchRecipesByIngredients');
		const endpoint = this._buildEndpointWithParameters(key);

		const /** @type {FetchResult} */ apiResponse = await this.firstFetch(
				endpoint,
				queryParams
			);
		return apiResponse;
	}

	/**
	 * @returns {Promise<FetchResult>}
	 */
	async getRandomRecipe(single = true) {
		const key = /** @type {EndpointKey} */ ('getRandomRecipes');
		const endpoint = this._buildEndpointWithParameters(key);

		const response = await this.firstFetch(endpoint);
		return response;
	}

	/**
	 *
	 * @param {number} id
	 * @returns {Promise<FetchResult>}
	 */
	async getRecipeInformation(id) {
		const endpoint = this._buildEndpointWithParameters('getRecipeInformation', {
			id
		});

		const fetchResult = await this.firstFetch(endpoint, { id });
		return fetchResult;
	}
	/**
	 *
	 * @param {number} id
	 * @returns {Promise<FetchResult>}
	 */
	async getRecipeSummary(id) {
		const endpoint = this._buildEndpointWithParameters('summarizeRecipe', {
			id
		});
		const fetchResult = await this.firstFetch(endpoint, { id });
		return fetchResult;
	}

	/**
	 *
	 * @returns
	 */
	async getTestApiRecipes(single = true) {
		const queryParams = { test: true };
		const endpoint = single ? '/recipes/test-random' : '/recipes/test';
		try {
			const responseJson = await this.firstFetch(endpoint, queryParams);
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
		return this.subsequentFetch(endpoint, params, opts);
	}

	/**
	 *
	 * @param {ErrorMeta} meta
	 * @returns {Promise<any>}
	 */
	async refetchFromMeta(meta) {
		if (meta?.endpoint) {
			return this.subsequentFetch(meta.endpoint, meta.params, meta.opts, meta);
		}
		if (meta?.urlAbs) {
			return this._fetchAbsolute(meta.urlAbs, meta.opts);
		}
		throw new Error('[REFETCH] Missing url/endpoint in meta');
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
		const responseJson = await this.firstFetch(endpoint, queryParams);
		return responseJson;
	}

	// NEW METHODS
	/**
	 *
	 * @param {string} urlOrKeyOrPath
	 * @param {Record<string, any> & {[key:string]: any}} [params={}]
	 * @param {RequestInit & {status?: number}} [opts={}]
	 * @returns {Promise<FetchResult>}
	 */
	async subsequentFetch(urlOrKeyOrPath, params = {}, opts = {}, meta = {}) {
		const str = String(urlOrKeyOrPath);
		const status = meta.status ?? undefined;

		const resolvedParams = this.#_withCachedFlags(
			params,
			status === 402 ? true : undefined
		);

		const isAbsolute = isAbsoluteUrl(str);
		if (!isAbsolute) {
			const endpoint = buildEndpoint(urlOrKeyOrPath);
			// const fullUrl =
		}

		const fullUrl = isAbsolute ? str : this._buildUrl(str, resolvedParams);
		const refetch = params.refetch ? true : false;
		const useCache = params.useCache ? true : false;
		/** @type {ErrorMeta} */
		const metaBase = {
			from: refetch ? 'refetch' : 'live',
			endpoint: isAbsolute ? undefined : str,
			urlAbs: fullUrl,
			params: resolvedParams,
			opts,
			isDev: appStore.getState().devMode ?? false
		};

		return this.#_fetchFromApi(fullUrl, opts, metaBase, true, true);
	}

	/**
	 * Abstraction of #_fetchFromApi();
	 * initial fetch only
	 * @param {string} urlOrKeyOrPath
	 * @param {Record<string, any>} params
	 * @param {RequestInit} opts
	 * @returns {Promise<FetchResult>}
	 */
	async firstFetch(urlOrKeyOrPath, params = {}, opts = {}) {
		const endpoint = buildEndpoint(urlOrKeyOrPath, params);
		const resolvedUrl = this._buildUrl(endpoint, params);

		/** @type {ErrorMeta} */
		const metaBase = {
			from: 'live',
			endpoint,
			urlAbs: resolvedUrl,
			params,
			opts,
			isDev: appStore.getState().devMode ?? false
		};

		return this.#_fetchFromApi(resolvedUrl, opts, metaBase, false);
	}

	#_makeParamsFromMeta(url, meta) {
		url = String(url);
		if (meta.params) {
			url.sParams = new URLSearchParams(meta.params);
		}
		return /** @type {URL} */ (url);
	}

	/**
	 *
	 * @param {string} fullyResolvedUrl
	 * @param {RequestInit|{}} [opts={}]
	 * @param {ErrorMeta} [metaBase={}]
	 * @param {boolean} [fromRefetch=false]
	 * @param {boolean} [forcedRefetch=false]
	 * @returns {Promise<FetchResult>}
	 */
	async #_fetchFromApi(
		fullyResolvedUrl,
		opts = {},
		metaBase = {},
		fromRefetch = false,
		forcedRefetch = false
	) {
		// Dev
		// console.log(
		// 	'Type of request: ',
		// 	'from refetch: ',
		// 	fromRefetch,
		// 	' 	forcedRefetch: ',
		// 	forcedRefetch
		// );

		const dev = appStore.getState().devMode ?? false;

		const useLive = appStore.getState().useLive ?? true;
		let useCache;

		const pubs = createErrorPublishing();
		const scope = getCurrentRouteScope();

		// Dev
		// console.count('[client.#_fetchFromApi]');

		const fetchUrl = new URL(fullyResolvedUrl, this.apiUrl);
		const { params } = metaBase;
		if (!params) {
			pubs.routeError(
				appStore,
				scope,
				new Error('[Client]: No params handed to client'),
				metaBase,
				undefined,
				undefined
			);
		}
		if (params.id) {
			if (!fetchUrl.searchParams.has('id')) {
				fetchUrl.searchParams.append('id', params.id);
			}
		}

		if (fromRefetch || useLive) {
			forcedRefetch = false;
		}

		if (!useLive) {
			useCache = true;

			if (!fetchUrl.searchParams.has('useCache')) {
				fetchUrl.searchParams.append('useCache', 'true');
			}

			if (!fetchUrl.searchParams.has('refetch')) {
				fetchUrl.searchParams.append('refetch', 'true');
			}
		}

		// DEV

		const dev_402_Url = new URL(fullyResolvedUrl, this.apiUrl);

		if (forcedRefetch) {
			if (!dev_402_Url.searchParams.has('test_402')) {
				dev_402_Url.searchParams.append('test_402', 'true');
			}
			if (params.id) {
				if (!dev_402_Url.searchParams.has('id')) {
					dev_402_Url.searchParams.append('id', `${params.id}`);
				}
			}
		}

		if (fromRefetch) {
			if (!dev_402_Url.searchParams.has('override')) {
				dev_402_Url.searchParams.append('override', 'true');
			}

			if (params.id)
				if (!dev_402_Url.searchParams.has('id')) {
					dev_402_Url.searchParams.append('id', `${params.id}`);
				}

			if (!dev_402_Url.searchParams.has('test_402')) {
				dev_402_Url.searchParams.delete('test_402');
			}
		}

		if (!useLive) {
			if (!dev_402_Url.searchParams.has('useCache')) {
				dev_402_Url.searchParams.append('useCache', 'true');
			}
			if (!dev_402_Url.searchParams.has('refetch')) {
				dev_402_Url.searchParams.append('refetch', 'true');
			}
			if (!dev_402_Url.searchParams.has('override')) {
				dev_402_Url.searchParams.append('override', 'true');
			}

			if (dev_402_Url.searchParams.has('test_402')) {
				dev_402_Url.searchParams.delete('test_402');
			}
		}

		/** @type {Response|undefined} */
		let response;
		try {
			// Dev only
			const reqOpts = /** @type {RequestInit} */ (opts);

			// if (dev) {
			response = await fetch(dev_402_Url, opts);
			// } else {
			// 	response = await fetch(fetchUrl, opts);
			// }

			/** @type {ErrorMeta} */
			const meta = {
				...metaBase,
				status: response.status,
				urlAbs: fullyResolvedUrl
			};

			if (!response.ok) {
				if (response.status === 402) {
					singleEmitter.publish('402', { error: 402 });
				}
				// error handling for HTTP errors
				const err = new HttpError(response, `HTTP ${response.status}`);
				const scope = /** @type {ErrorScope} */ (getCurrentRouteScope());
				createErrorPublishing().routeError(
					appStore,
					scope,
					new HttpError(response),
					meta,
					undefined,
					response
				);
				return null;
			}

			// Check custom header
			const liveAllowed =
				response.headers.get('x-cayenne-live-allowed') === '1';
			if (liveAllowed) appStore.setState({ useLive: true });

			const text = await response.text();
			/** @type {{} & {allowLive?: boolean, data?: any}} */

			const data = text ? this.tryJson(text) : null;
			if (!data) {
				return;
			}
			return { data, meta };
		} catch (error) {
			/** @type {ErrorMeta} */
			const meta = {
				...metaBase,
				urlAbs: fullyResolvedUrl,
				status: response?.status
			};
			createErrorPublishing().routeError(
				appStore,
				getCurrentRouteScope(),
				error,
				meta,
				undefined,
				response
			);
		}
	}

	/**
	 *
	 * @param {Response} res
	 * @returns {Promise<string>}
	 */
	async tryText(res) {
		try {
			return await res.text();
		} catch {
			return '';
		}
	}

	/**
	 *
	 * @param {string} text
	 * @returns {{} | string}
	 */
	tryJson(text) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}

	/**
	 * Retry the exact same URL you just attempted (no re-resolution).
	 * Not sure if needed yet - better to have and not need
	 * @param {ErrorMeta} meta
	 * @param {RequestInit} [opts={}]
	 * @returns {Promise<FetchResult>}
	 */
	async #_retrySame(meta, opts = {}) {
		const url = meta.urlAbs;
		const metaBase = { ...meta, opts };
		return this.#_fetchFromApi(url, opts, metaBase);
	}

	/**
	 *
	 * @param {Record<string, any>} params
	 * @param {boolean|undefined} useCache
	 */
	#_withCachedFlags(params = {}, useCache) {
		/** @type {Record<string, any> & {useCache?: boolean}} */
		const next = { ...params, refetch: true };
		if (useCache !== undefined) next.useCache = useCache;
		return next;
	}
}
