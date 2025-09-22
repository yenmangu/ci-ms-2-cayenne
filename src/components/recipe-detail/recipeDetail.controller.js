/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/componentTypes.js').RecipeDetailParams} RecipeDetailParams
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
 */

import * as service from './recipeDetail.service.js';
import { renderRecipeDetail } from './recipeDetail.view.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import { appStore } from '../../appStore.js';
import { config } from '../../config/stateConfigs.js';

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

		this.stateSubscription = appStore.subscribe(
			/** @param {AppState} state  */
			state => {
				this.unitLength = state.unitLength;
				this.measure = state.measureSystem;
			}
		);

		this.measure = 'metric';
		this.unitLength = 'unitShort';

		/** @type {HTMLElement} */
		this.recipeContainer = null;

		/** @type {HTMLElement} */
		this.toggleContainer = null;

		/** @type {ToggleComponent} */
		this.measureToggle = null;

		/** @type {ToggleComponent} */
		this.unitLengthToggle = null;
	}

	render(renderAll = false) {
		console.log('Implementing render()');
		this.appRoot.innerHTML = renderRecipeDetail(
			this.fetchedRecipe,
			this.summary
		);
		this.toggleContainer = document.getElementById('toggleContainer');
		if (renderAll) {
			this.#_renderToggles();
			// Other UI render methods
		}
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

	#_renderToggles() {
		if (this.toggleContainer) {
			this.#_renderMeasureToggle();
			this.#_renderUnitLengthToggle();
		} else {
			console.warn('recipeContainer not found: toggles not rendered');
		}
	}

	#_renderMeasureToggle() {
		if (this.measureToggle) return;
		this.measureToggle = new ToggleComponent(this.toggleContainer, {
			key: 'measureSystem',
			onValue: 'us',
			offValue: 'metric',
			label: 'measure system'
		});
		this.measureToggle.render();
	}

	#_renderUnitLengthToggle() {
		if (this.unitLengthToggle) return;
		this.unitLengthToggle = new ToggleComponent(this.toggleContainer, {
			key: 'unitLength',
			onValue: 'unitLong',
			offValue: 'unitShort',
			label: 'unit length'
		});
		this.unitLengthToggle.render();
	}

	destroy() {
		if (this.stateSubscription) {
			this.stateSubscription.unsubscribe();
		}
	}
}
