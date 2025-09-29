import { stringToHtml } from '../../util/htmlToElement.js';
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

		this.randomRecipe = null;
		this.randomRecipeCard = null;
	}

	async init() {
		this.landingPageComponent = stringToHtml(renderLandingPage());
		this.randomRecipe = await this.service.getRandomRecipe();
		console.log(`${this.randomRecipe ? 'recipeFound' : 'No recipe found'}`);

		this.landingSearch = new SearchBar(this.landingPageComponent);
	}

	render() {
		if (this.landingPageComponent) {
			this.container.appendChild(this.landingPageComponent);
			this.landingAppended = true;
			// console.log(this.landingAppended);
			this.#_renderSearch();
		} else {
			console.log('No landing page component');
		}
	}

	#_renderSearch() {
		if (this.landingAppended && this.landingSearch) {
			// console.log('Rendering search');

			this.landingSearch.init();
		}
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
