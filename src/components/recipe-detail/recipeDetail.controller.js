/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/componentTypes.js').RecipeDetailParams} RecipeDetailParams
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialAppState
 * @typedef {import('../../types/stateTypes.js').UnitLocale} UnitLocale
 * @typedef {import('../../types/stateTypes.js').UnitLength} UnitLength
 */

import * as service from './recipeDetail.service.js';
import { renderRecipeDetail } from './recipeDetail.view.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import { appStore } from '../../appStore.js';
import { config } from '../../config/stateConfigs.js';
import { stringToHtml } from '../../util/htmlToElement.js';

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

		/** @type {HTMLElement} */
		this.recipeDetailComponent = null;

		this.recipeId = detailParams.recipeId;
		this.service = service.createDetailService({ recipId: this.recipeId });
		/** @type {Recipe} */ this.fetchedRecipe = null;
		/** @type {Summary} */ this.summary = null;

		this.noSummaryPlaceholder = {
			id: 0,
			title: 'Not Available',
			summary: 'No summary available.'
		};

		/** @type {UnitLocale} */
		this.unitLocale = 'metric';

		/** @type {UnitLength} */
		this.unitLength = 'unitShort';

		/** @type {HTMLElement} */
		this.recipeContainer = null;

		/** @type {HTMLElement} */
		this.toggleContainer = null;

		/** @type {ToggleComponent} */
		this.unitLocaleToggle = null;

		/** @type {ToggleComponent} */
		this.unitLengthToggle = null;

		this.lastState = null;
		this.subscription = null;

		this.componentReady = false;

		this.lastState = appStore.getState();
		// this.init();
	}

	async init() {
		if (!this.subscription) {
			this.subscription = appStore.subscribe(state => {
				this.handleStateChange(state);
			});
		}
		try {
			await this.publicTest();
		} catch (error) {
			throw error;
		}

		// Build the component using the HTML string;
		this.recipeDetailComponent = stringToHtml(
			renderRecipeDetail(this.fetchedRecipe, this.summary)
		);
		// console.log('Component: ', this.recipeDetailComponent);
		this.componentReady = true;
	}

	/**
	 *
	 * @param {PartialAppState} state
	 */
	handleStateChange(state) {
		this.lastState = state;
		this.unitLength = state.unitLength;
		this.unitLocale = state.unitLocale;
		if (this.recipeDetailComponent) {
			this.#_hydrate(state);
		}
	}

	render() {
		// console.log('Implementing render()');
		if (this.recipeDetailComponent instanceof HTMLElement) {
			// console.log('Is Instance of HTMLElement');
		}
		if (this.appRoot) this.appRoot.append(this.recipeDetailComponent);
		else console.warn('No App root');

		this.toggleContainer = document.getElementById('toggleContainer');

		if (this.toggleContainer) {
			this.#_renderToggles();
		} else {
			console.warn('No toggle container');
		}
		// Other UI render methods
	}

	async fetchRecipe() {
		await this.service.fetchRecipeById(this.recipeId, {});
		this.fetchedRecipe = this.service.fetchedRecipe;
		this.summary = this.service.recipeSummary;

		// console.log('RecipeDetailController: ', this);
	}

	async publicTest() {
		await this._testEndpoint(this.recipeId);
	}

	async _testEndpoint(id) {
		const { recipe, summary } = await service.fetchRecipeDetail(id);
		this.fetchedRecipe = recipe;

		this.summary = summary ?? this.noSummaryPlaceholder;

		appStore.setState({ currentRecipe: this.fetchedRecipe });
	}

	_getIdFromUrl() {
		throw new Error('Method not implemented.');
	}

	#_hydrate(state) {
		// this.#_updateToggleLabels();
		this.#_handleIngredientUpdate();
	}

	#_getIngredientCards() {
		const ingredientCards = this.recipeDetailComponent.querySelectorAll(
			"[data-card-type='ingredientCard']"
		);
		if (ingredientCards) {
			return /** @type {NodeListOf<HTMLElement>} */ (ingredientCards);
		} else {
			throw new Error('Error, no IngredientCards found in DOM');
		}
	}

	// #_updateToggleLabels() {
	// 	this.unitLocaleToggle.toggleText = this.unitLocale;
	// 	this.unitLengthToggle.toggleText = this.unitLength;
	// }

	#_handleIngredientUpdate() {
		const cards = this.#_getIngredientCards();
		const { currentRecipe } = this.lastState;
		cards.forEach(card => {
			let id = card.dataset.ingredientId;
			if (!id) {
				throw new Error('Error: `ingredientId` not set on HTMLElement dataset');
			}

			const ingredient = currentRecipe.extendedIngredients.find(
				k => k.id === parseInt(id, 10)
			);

			if (!ingredient) throw new Error(`Ingredient with id ${id} not found`);

			const measureObj = ingredient.measures[this.unitLocale];
			if (!measureObj) {
				throw new Error(
					`No measure for locale '${this.unitLocale}' on ingredient id ${id}`
				);
			}

			const amount =
				typeof measureObj.amount === 'number'
					? measureObj.amount
					: ingredient.amount ?? '';

			const units = measureObj[this.unitLength] ?? ingredient.unit ?? '';

			const cardUnit = card.querySelector('span[data-label="units"]');
			const cardAmounts = card.querySelector('span[data-label="amounts"]');

			if (cardUnit) {
				/** @type {HTMLElement} */ (cardUnit).innerText = units;
			}
			if (cardAmounts) {
				/** @type {HTMLElement} */ (cardAmounts).innerText =
					amount.toString() ?? 'Not available';
			}
		});
	}

	#_renderToggles() {
		if (this.toggleContainer) {
			console.log('Found toggleContainer');

			// this.#_renderUnitLocaleToggle();
			// this.#_renderUnitLengthToggle();
		} else {
			console.warn('recipeContainer not found: toggles not rendered');
		}
	}

	// #_renderUnitLocaleToggle() {
	// 	if (this.unitLocaleToggle) {
	// 		console.log('measure toggle exists');
	// 		this.unitLocale = null;
	// 	}
	// 	this.unitLocaleToggle = new ToggleComponent(this.toggleContainer, {
	// 		key: 'unitLocale',
	// 		onValue: 'us',
	// 		offValue: 'metric',
	// 		initialValue: this.unitLocale ?? 'metric'
	// 	});
	// 	this.unitLocaleToggle.render();
	// }

	// #_renderUnitLengthToggle() {
	// 	if (this.unitLengthToggle) {
	// 		console.log('unit length toggle exists');
	// 		this.unitLengthToggle = null;
	// 	}
	// 	this.unitLengthToggle = new ToggleComponent(this.toggleContainer, {
	// 		key: 'unitLength',
	// 		onValue: 'unitLong',
	// 		offValue: 'unitShort',
	// 		initialValue: this.unitLength ?? 'unitShort'
	// 	});
	// 	if (this.unitLengthToggle.toggleConfig.label)
	// 		this.unitLengthToggle.render();
	// }

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
