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
			const results = await fetchRecipeDetail(id);

			if (results.recipe && results.summary) {
				service.fetchedRecipe = results.recipe;
				service.recipeSummary = results.summary;
			} else {
				return null;
			}
			return {
				fetchedRecipe: service.fetchedRecipe,
				summary: service.recipeSummary
			};
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
export async function fetchRecipeDetail(recipeId) {
	const dev = false;
	const client = getClient();
	const scope = getCurrentRouteScope();
	const pubs = createErrorPublishing();
	/** @type {RecipeFull} */ let recipe;
	/** @type {Summary} */ let summary;

	// Fire parallel
	const d_promise = client.getRecipeInformation(recipeId);
	const s_promise = client.getRecipeSummary(recipeId);
	/** @type {[FetchResult|null, FetchResult|null]} */
	let results;
	try {
		const settled = await Promise.allSettled([d_promise, s_promise]);
		console.log('Settled: ', settled);

		const detailOk = settled[0].status === 'fulfilled' && settled[0].value;
		const sumOk = settled[1].status === 'fulfilled' && settled[1].value;

		if (detailOk && sumOk) {
			/** @type {RecipeFull} */
			const recipe = /** @type {RecipeFull} */ (detailOk.data);

			/** @type {Summary} */
			const summary = /** @type {Summary} */ (sumOk.data);
			return { recipe, summary };
		}

		/** @type {ErrorMeta[]} */
		const metas = [];
		if (
			detailOk &&
			settled[0].status === 'fulfilled' &&
			settled[0].value?.meta
		) {
			metas.push(settled[0].value.meta);
		} else if (!detailOk) {
			metas.push({
				endpoint: '/recipes/{id}/information',
				params: { id: recipeId }
			});
		}
		if (sumOk && settled[1].status === 'fulfilled' && settled[1].value?.meta) {
			metas.push(settled[1].value.meta);
		} else if (!sumOk) {
			metas.push({
				endpoint: '/recipes/{id}/summary',
				params: { id: recipeId }
			});
		}

		pubs.reportRefetchMany(appStore, scope, metas);

		return null;
	} catch (err) {
		//
		createErrorPublishing().routeError(appStore, scope, err, {
			cmd: 'refetchMany'
		});
	}
}

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}
