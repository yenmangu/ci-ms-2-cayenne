import { stringToHtml } from '../../util/htmlToElement.js';
import { renderLoading } from './loading.view.js';

export class Loading {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {string} */
		this.html = renderLoading();

		/** @type {HTMLElement} */
		this.el = null;

		this.isLoading = true;
	}

	destroy() {
		this.isLoading = false;
		this.container.removeChild(this.el);
	}

	render() {
		this.el = stringToHtml(this.html);
		if (this.isLoading) this.container.appendChild(this.el);
	}
}
