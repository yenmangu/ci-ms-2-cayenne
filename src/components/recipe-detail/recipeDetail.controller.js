/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/componentTypes.js').RecipeDetailParams} RecipeDetailParams
 */

import * as service from './recipeDetail.service.js';
import { renderRecipeDetail } from './recipeDetail.view.js';

/**
 * @component
 * @domain
 *
 * Top level routed component for '/recipe/
 */
export class RecipeDetail {
	/**
	 * Usually #app
	 * @param {HTMLElement} appRoot
	 * @param {RecipeDetailParams} detailParams
	 */
	constructor(appRoot, detailParams) {
		this.appRoot = appRoot;
		this.recipeId = detailParams.recipeId;
		this.service = service.createDetailService({ recipId: this.recipeId });
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
		console.log('Implementing render()');
		this.appRoot.innerHTML = renderRecipeDetail(
			this.fetchedRecipe,
			this.summary
		);
	}

	async fetchRecipe() {
		await this.service.fetchRecipeById(this.recipeId, {});
		this.fetchedRecipe = this.service.fetchedRecipe;
		this.summary = this.service.recipeSummary;

		console.log('RecipeDetailController: ', this);
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
