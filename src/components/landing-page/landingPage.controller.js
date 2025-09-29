/**
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCardObject
 */

import { stringToHtml } from '../../util/htmlToElement.js';
import { RecipeCard } from '../recipe-card/recipeCard.controller.js';
import { SearchBar } from '../search-bar/searchBar.controller.js';
import * as service from './landingPage.service.js';
import { renderLandingPage } from './landingPage.view.js';

export class LandingPage {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;

		this.landingPageComponent = null;
		this.service = service.createLandingService();

		/** @type {HTMLElement} */
		this.randomRecipeContainer = null;

		/** @type {HTMLElement} */
		this.searchBarContainer = null;

		/** @type {RecipeCardObject}*/
		this.randomRecipe = null;
		this.randomRecipeCard = null;
	}

	async init() {
		this.landingPageComponent = stringToHtml(renderLandingPage());

		this.#_collectContainers();
		this.randomRecipe = await this.service.getRandomRecipe();

		console.log(this.randomRecipe ? this.randomRecipe : 'No recipe found');

		this.landingSearch = new SearchBar(this.searchBarContainer);
		this.randomRecipeContainer =
			this.landingPageComponent.querySelector('#random-recipe');
		if (this.randomRecipeContainer)
			console.log('Random container found: ', this.randomRecipeContainer);

		this.randomRecipeCard = new RecipeCard(
			this.randomRecipeContainer,
			this.randomRecipe
		);
	}

	#_collectContainers() {
		this.randomRecipeContainer =
			this.landingPageComponent.querySelector('#random-recipe');
		this.searchBarContainer = this.landingPageComponent.querySelector(
			'#landing-search-bar'
		);
	}

	render() {
		if (this.landingPageComponent) {
			this.container.appendChild(this.landingPageComponent);
			this.landingAppended = true;
			// console.log(this.landingAppended);
			this.#_coordinateLanding();
		} else {
			throw new Error('Landing component not initialised');
		}
	}

	#_coordinateLanding() {
		if (!this.landingAppended)
			throw new Error('Landing component not appended to container');
		if (!this.landingSearch) throw new Error('Search Bar not initialised');

		this.#_renderSearch();
		this.#_renderRandomRecipe();
	}

	#_renderSearch() {
		if (this.landingAppended && this.landingSearch) {
			// console.log('Rendering search');

			this.landingSearch.init();
		}
	}

	#_renderRandomRecipe() {
		this.#_renderTitle();
		this.randomRecipeCard.render();
	}

	#_renderTitle() {
		const titleEl = document.createElement('h3');
		titleEl.innerText = 'Get Inspired';
		this.randomRecipeContainer.appendChild(titleEl);
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
