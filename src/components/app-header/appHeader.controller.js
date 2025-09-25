/**
 * @typedef {import('../../types/stateTypes.js').UnitLength} UnitLength
 * @typedef {import('../../types/stateTypes.js').UnitLocale} UnitLocale
 */

import { appStore } from '../../appStore.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import * as service from './appHeader.service.js';
import { renderAppHeader } from './appHeader.view.js';

export class AppHeader {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {HTMLElement} */
		this.header = stringToHtml(renderAppHeader());

		/** @type {HTMLElement} */
		this.toggleContainer = null;

		/** @type {HTMLElement} */
		this.unitLocaleToggle = null;

		/** @type {HTMLElement} */
		this.unitLengthToggle = null;

		/** @type {ToggleComponent} */
		this.unitLengthToggleComponent = null;

		/** @type {ToggleComponent} */
		this.unitLocaleToggleComponent = null;

		/** @type {UnitLocale} */
		this.unitLocale = 'metric';

		/** @type {UnitLength} */
		this.unitLength = 'unitShort';

		this.subscription = appStore.subscribe(state => {
			this.unitLength = state.unitLength ?? 'unitShort';
			this.unitLocale = state.unitLocale ?? 'metric';
		});
	}

	init() {
		this.toggleContainer = /** @type {HTMLElement} */ (
			this.header.querySelector('.toggle-container')
		);
		if (this.toggleContainer) {
			this.#_initToggles();
		}
	}

	#_initToggles() {
		// Enable unit length toggle below
		// this.unitLengthToggleComponent = new ToggleComponent(this.toggleContainer, {
		// 	key: 'unitLength',
		// 	onValue: 'unitLong',
		// 	offValue: 'unitShort',
		// 	initialValue: this.unitLength ?? 'unitShort'
		// });
		this.unitLocaleToggleComponent = new ToggleComponent(this.toggleContainer, {
			key: 'unitLocale',
			onValue: 'us',
			offValue: 'metric',
			initialValue: this.unitLocale ?? 'metric',
			className: 'unit-slider-toggle'
		});
		this.unitLocaleToggleComponent.render();
		this.#_updateColours();
		// this.unitLengthToggleComponent.render();
	}
	#_updateColours() {
		if (this.unitLocaleToggleComponent) {
		}
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
