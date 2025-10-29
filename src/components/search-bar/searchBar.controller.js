/**
 * @typedef {import('./searchBar.service.js').SearchService} Service
 * @typedef {import('../../types/responseTypes.js').SearchResponse} SearchResponse
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { appStore } from '../../appStore.js';
import { AppRouter } from '../../router/appRouter.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { renderNoResults } from './noResults.view.js';
import * as service from './searchBar.service.js';
import { renderSearchBar } from './searchBar.view.js';

export class SearchBar {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {Service} */
		this.service = service.createSearchService();

		/** @type {string} */
		this.htmlString = renderSearchBar();

		/** @type {HTMLElement} */
		this.searchComponent = stringToHtml(renderSearchBar());

		/** @type {HTMLInputElement} */
		this.searchBarInput = null;

		/** @type {string[]} */
		this.searchQuery = [];

		/** @type {Record<string, *>} */
		this.searchParams = {};

		/** @type {HTMLElement} */
		this.noResultsEl = null;
	}

	init() {
		if (!this.searchComponent) {
			throw new Error('Search component not initialised as HTMLElement');
		}

		this.searchBarInput = this.searchComponent.querySelector('input');
		if (!this.searchBarInput) {
			throw new Error('Search input element not found');
		}

		this.submitButton = this.searchComponent.querySelector(
			'button[type="submit"]'
		);
		if (this.submitButton) {
			console.log('Submit button found');
		}

		this.#_wireEventListeners();
		this.render();
	}

	#_wireEventListeners() {
		this.searchComponent.addEventListener('submit', e => {
			e.preventDefault();
			this.handleSubmit();
		});
	}

	handleSubmit() {
		const value = this.searchBarInput.value.trim().split(' ');
		// const string = value.join(',');

		if (!value) return;
		appStore.setState({ searchQuery: [this.searchBarInput.value] });

		AppRouter.navigate('/recipe-grid', { search: value });
	}

	/**
	 *
	 * @param {RecipeCard[]} recipeArray
	 */
	#_handleResponse(recipeArray) {}

	/**
	 *
	 * @param {string} string
	 */
	#_addToState(string) {
		appStore.addSearchString(string);
	}

	render() {
		this.container.appendChild(this.searchComponent);
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
