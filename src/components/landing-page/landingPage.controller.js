/**
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCardObject
 * @typedef {import('./landingPage.service.js').LandingService} LandingService
 */

import { appStore } from '../../appStore.js';
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

		/** @type {LandingService} */
		this.service = service.createLandingService();

		/** @type {HTMLElement} */
		this.randomRecipeContainer = null;

		/** @type {HTMLElement} */
		this.searchBarContainer = null;

		/** @type {RecipeCardObject}*/
		this.randomRecipe = null;
		this.randomRecipeCard = null;

		/** @type {HTMLButtonElement} */
		this.randomButton = null;

		this.subscription = appStore.subscribe(state => {
			if (state.currentRandom) {
				console.log('New random: ', state.currentRandom);

				this.randomRecipe = this.service.extractCard(state.currentRandom);
				this.#_renderRandomRecipe();
			}
		});
		this.randomBtnWired = false;
	}

	async init() {
		this.landingPageComponent = stringToHtml(renderLandingPage());

		this.#_collectContainers();
		this.service.updateStoreRandomRecipe();

		this.landingSearch = new SearchBar(this.searchBarContainer);
		this.randomRecipeContainer =
			this.landingPageComponent.querySelector('#random-recipe');
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
		this.#_renderTitle();
	}

	#_renderSearch() {
		if (this.landingAppended && this.landingSearch) {
			// console.log('Rendering search');

			this.landingSearch.init();
		}
	}

	#_renderRandomRecipe() {
		if (!this.randomRecipeCard) {
			this.randomRecipeCard = new RecipeCard(
				this.randomRecipeContainer,
				this.randomRecipe
			);
			this.randomRecipeCard.cardEl.classList.add('recipe-card__landing');
			this.randomRecipeCard.render();
		} else {
			this.randomRecipeCard.update(this.randomRecipe);
		}
	}

	#_renderTitle() {
		const titleWrapper = document.createElement('div');
		titleWrapper.classList = 'container container__landing-title';
		const titleEl = document.createElement('h3');
		const fetchNewRandomBtn = document.createElement('button');
		this.randomButton = fetchNewRandomBtn;
		fetchNewRandomBtn.classList = 'btn btn-primary btn__random';
		fetchNewRandomBtn.innerText = 'New Random';
		titleEl.innerText = 'Get Inspired';
		titleWrapper.appendChild(titleEl);
		const buttonWrapper = document.createElement('div');
		buttonWrapper.classList = 'wrapper wrapper__random-button';
		const notFeelingIt = document.createElement('p');
		notFeelingIt.innerText = 'Not feeling it?';
		buttonWrapper.appendChild(notFeelingIt);
		buttonWrapper.appendChild(fetchNewRandomBtn);
		titleWrapper.appendChild(buttonWrapper);
		this.searchBarContainer.insertAdjacentElement('afterend', titleWrapper);
		this.#_wireEvents();
	}

	#_wireEvents() {
		if (this.randomButton && !this.randomBtnWired) {
			this.randomButton.addEventListener('click', () => {
				this.#_onFetchNewRandom();
			});
			this.randomBtnWired = true;
		}
	}

	#_onFetchNewRandom() {
		this.service.updateStoreRandomRecipe();
	}

	destroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
