/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/errorTypes.js').ErrorScope} ErrorScope
 * @typedef {import('../../types/responseTypes.js').FetchResult} FetchResult
 * @typedef {import('../../types/stateTypes.js').ErrorMeta} ErrorMeta
 */

/**
 * @typedef {object} DetailService
 * @property {RecipeFull} fetchedRecipe
 * @property {Summary} recipeSummary
 * @property {object}	[opts]
 * @property {(
 * 	id:number, params: Record<string,
 * 	string | number>
 * 	) => Promise<{fetchedRecipe:RecipeFull, summary:Summary}>
 * } fetchRecipeById
 *
 */

import { getClient } from '../../api/client.singleton.js';
import { appStore } from '../../appStore.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';
import { createErrorPublishing } from '../../error/pipe/publishFactory.js';
import { getCurrentRouteScope } from '../../error/util/errorScope.js';

/**
 *
 * @param {*} opts
 * @returns {DetailService}
 */
export const createDetailService = opts => {
	const pubs = createErrorPublishing();
	const client = getClient();
	/** @type {DetailService} */
	const service = {
		fetchedRecipe: null,
		/**
		 *
		 * @param {number} [id]
		 * @param {*} [params]
		 * @returns {Promise<{fetchedRecipe: RecipeFull, summary:Summary}>}
		 */
		fetchRecipeById: async (id, params = {}) => {
			let results;
			try {
				results = await fetchRecipeDetail(id);
				if (results) {
					service.fetchedRecipe = results.recipe;
					service.recipeSummary =
						results.summary ??
						/** @type {Summary} */ (
							/** @type {unknown} */ (results.recipe.summary)
						);
				}
				return {
					fetchedRecipe: service.fetchedRecipe,
					summary: service.recipeSummary
				};
			} catch (err) {
				pubs.routeError(appStore, getCurrentRouteScope(), err, undefined);
				return null;
			}
		},
		opts: {},

		recipeSummary: null
	};

	return service;
};

/**
 *
 * @param {number} recipeId
 *
 * @returns {Promise<{recipe:RecipeFull, summary:Summary}>}
 */
/**
 * Fetch recipe detail, using the embedded summary if present; otherwise fetch the summary.
 * @param {number} recipeId
 * @returns {Promise<{ recipe: RecipeFull, summary: Summary }>}
 */
export async function fetchRecipeDetail(recipeId) {
	const client = getClient();
	// 1) Always fetch the recipe first
	const infoResult = /** @type {FetchResult} */ (
		await client.getRecipeInformation(recipeId)
	);

	const recipe = /** @type {RecipeFull} */ (infoResult.data);
	if (!recipe || typeof recipe.id !== 'number') {
		throw new Error('Recipe payload missing or invalid.');
	}

	// 2) Short-circuit if we can build a summary immediately
	const derived = buildSummaryFromRecipe(recipe);
	if (derived) {
		return { recipe, summary: derived };
	}

	// 3) Otherwise, fetch the summary
	const sumResult = /** @type {FetchResult} */ (
		await client.getRecipeSummary(recipeId)
	);

	const summary = /** @type {Summary} */ (sumResult.data);
	if (!summary || summary.id !== recipe.id) {
		throw new Error('Summary payload missing, invalid, or mismatched id.');
	}

	return { recipe, summary };
}

// export async function fetchRecipeDetail(recipeId) {
// 	const dev = false;
// 	const client = getClient();
// 	const scope = getCurrentRouteScope();
// 	const pubs = createErrorPublishing();
// 	/** @type {RecipeFull} */ let recipe;
// 	/** @type {Summary} */ let summary;

// 	// Attempt from recipe only - preferred - less cost on API quota
// 	/** @type {FetchResult} */
// 	let initialFetch;
// 	try {
// 		console.log('Trying from recipe');
// 		const scope = getCurrentRouteScope();
// 		initialFetch = await client.getRecipeInformation(recipeId);
// 		console.log('Initial fetch: ', initialFetch);

// 		if (!initialFetch)
// 			pubs.routeError(appStore, scope, new Error('No initial fetch'));

// 		const maybeRecipe = /** @type {RecipeFull} */ (initialFetch.data);
// 		if (!maybeRecipe || !maybeRecipe.id) {
// 			// pubs.routeError(
// 			// 	appStore,
// 			// 	scope,
// 			// 	new Error('Data missing in fetch result')
// 			// );
// 		}
// 		recipe = maybeRecipe;
// 		if (typeof recipe.summary !== 'string') {
// 			const sumFetch = await client.getRecipeSummary(recipeId);
// 			if (!sumFetch) {
// 				// pubs.routeError(appStore, scope, new Error('Error fetching summary'));
// 			}
// 			const maybeSum = /** @type {Summary} */ (sumFetch.data);
// 			if (!maybeSum || !maybeSum.id) {
// 				// pubs.routeError(appStore, scope, new Error('No summary in fetch'));
// 			}
// 			summary = maybeSum;
// 		}
// 	} catch (error) {
// 		pubs.routeError(
// 			appStore,
// 			getCurrentRouteScope(),
// 			error,
// 			undefined,
// 			'Error caught attempting recipe and summary fetch'
// 		);
// 		console.log(appStore.getState().errors);

// 		return;
// 	}

// 	console.log('Trying parallel');

// 	// Fire parallel - Fallback
// 	const d_promise = client.getRecipeInformation(recipeId);
// 	const s_promise = client.getRecipeSummary(recipeId);
// 	/** @type {[FetchResult|null, FetchResult|null]} */
// 	let results;

// 	try {
// 		const settled = await Promise.allSettled([d_promise, s_promise]);
// 		console.log('Settled: ', settled);

// 		const detailOk = settled[0].status === 'fulfilled' && settled[0].value;
// 		const sumOk = settled[1].status === 'fulfilled' && settled[1].value;

// 		if (detailOk && sumOk) {
// 			/** @type {RecipeFull} */
// 			const recipe = /** @type {RecipeFull} */ (detailOk.data);

// 			/** @type {Summary} */
// 			const summary = /** @type {Summary} */ (sumOk.data);
// 			return { recipe, summary };
// 		}

// 		/** @type {ErrorMeta[]} */
// 		const metas = [];
// 		if (
// 			detailOk &&
// 			settled[0].status === 'fulfilled' &&
// 			settled[0].value?.meta
// 		) {
// 			metas.push(settled[0].value.meta);
// 		} else if (!detailOk) {
// 			metas.push({
// 				endpoint: '/recipes/{id}/information',
// 				params: { id: recipeId }
// 			});
// 		}
// 		if (sumOk && settled[1].status === 'fulfilled' && settled[1].value?.meta) {
// 			metas.push(settled[1].value.meta);
// 		} else if (!sumOk) {
// 			metas.push({
// 				endpoint: '/recipes/{id}/summary',
// 				params: { id: recipeId }
// 			});
// 		}

// 		pubs.reportRefetchMany(appStore, scope, metas);

// 		return null;
// 	} catch (err) {
// 		//
// 		createErrorPublishing().routeError(appStore, scope, err, {
// 			cmd: 'refetchMany'
// 		});
// 	}
// }

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}

export function buildSummaryFromRecipe(recipe) {
	const hasString = typeof recipe.summary === 'string';
	const cleaned = hasString ? recipe.summary.trim() : '';
	if (!hasString || cleaned.length === 0) return null;

	return {
		id: recipe.id,
		title: recipe.title,
		summary: cleaned
	};
}
