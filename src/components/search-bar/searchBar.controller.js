import { stringToHtml } from '../../util/htmlToElement.js';
import * as service from './searchBar.service.js';
import { renderSearchBar } from './searchBar.view.js';

export class SearchBar {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {string} */
		this.htmlString = renderSearchBar();

		/** @type {HTMLElement} */
		this.searchComponent = stringToHtml(renderSearchBar());

		/** @type {HTMLInputElement} */
		this.searchBarInput = null;
	}

	init() {
		if (this.searchComponent) {
			this.container.appendChild(this.searchComponent);
		} else {
			console.log('No Search');
		}
	}

	render() {
		console.warn('Function render() not yet implemented.');
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
