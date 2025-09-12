/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 */

import * as service from './recipeDetail.service.js';
import { renderRecipeDetail } from './recipeDetail.view.js';

export class RecipeDetail {
	/**
	 * Usually #app
	 * @param {HTMLElement} appRoot
	 * @param {number} recipeId
	 */
	constructor(appRoot, recipeId) {
		this.appRoot = appRoot;
		this.recipeId = recipeId;
		/** @type {Recipe} */ this.fetchedRecipe = null;
		/** @type {Summary} */ this.summary = null;
		this.noSummaryPlaceholder = {
			id: 0,
			title: 'Not Available',
			summary: 'No summary available.'
		};
	}

	render() {
		console.warn('Function render() not yet implemented.');
	}

	async publicTest() {
		await this._testEndpoint(this.recipeId);
	}

	async _testEndpoint(id) {
		const { recipe, summary } = await service.fetchRecipeDetail(id);
		this.fetchedRecipe = recipe;
		this.summary = summary ?? this.noSummaryPlaceholder;

		console.log('fetched recipe: ', this.fetchedRecipe);
		console.log(
			this.summary
				? `Fetched summary: ${JSON.stringify(this.summary)}`
				: 'No sumamry available'
		);

		const toRender = renderRecipeDetail(this.fetchedRecipe, this.summary);
	}

	_getIdFromUrl() {
		throw new Error('Method not implemented.');
	}
}
