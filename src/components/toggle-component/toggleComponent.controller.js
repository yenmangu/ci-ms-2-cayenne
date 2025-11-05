/**
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialAppState
 * @typedef {import('./toggleComponent.view.js').ToggleConfig} ToggleConfig
 */

import * as service from './toggleComponent.service.js';
import { appStore } from '../../appStore.js';
import { renderToggleComponent } from './toggleComponent.view.js';
import { config } from '../../config/stateConfigs.js';
import { stringToHtml } from '../../util/htmlToElement.js';

export class ToggleComponent {
	/**
	 * @param {HTMLElement} container
	 * @param {ToggleConfig} [options]
	 */
	constructor(container, options) {
		/** @type {HTMLElement} */
		this.container = container;

		this.toggleConfig = options;

		/** @type {HTMLInputElement} */
		this.toggle = null;
		this.key = options.key;
		this.toggleText = '';
		this.latestState = null;
		this.subscription = null;
		this.init();
	}

	#_hydrateToggle() {
		this.#_updateToggleState();
		this.#_updateToggleText();
	}

	#_updateToggleState() {
		this.toggle.checked =
			this.latestState[this.key] === this.toggleConfig.onValue;
	}

	/**
	 *
	 * @param {string} key
	 * @param {*} val
	 */
	#_updateToggleText() {
		console.log(this.toggle.id);

		const label = document.querySelector(
			`label[for="${this.toggleConfig.key}"]`
		);
		if (!label) {
			throw new Error(`Label for toggle: ${this.key} not found`);
		}

		label.textContent = config[this.latestState[this.key]];
	}

	destroy() {}

	init() {
		// Dev debugging
		// console.debug(`ToggleComponent: ${this.toggleConfig.key}`);

		this.toggleConfig.label =
			config[this.toggleConfig.initialValue] ??
			`No value found for ${this.toggleConfig.initialValue}`;

		// Dev logging
		// console.log(
		// 	'[SANITY CHECK]: ToggleConfig label: ',
		// 	this.toggleConfig.label
		// );

		this.toggleWithWrapper = stringToHtml(
			renderToggleComponent(this.toggleConfig)
		);

		this.subscription = appStore.subscribe(state => {
			this.latestState = state;
			this.#_hydrateToggle();
		});
	}

	render() {
		this.container.append(this.toggleWithWrapper);
		this.toggle = /** @type {HTMLInputElement} */ (
			document.getElementById(this.key)
		);
		if (!(this.toggle instanceof HTMLInputElement)) {
			throw new Error('toggle NOT instance of HTMLInputElement');
		}

		this.toggle.addEventListener('change', e => {
			e.preventDefault();
			const newVal = this.toggle.checked
				? this.toggleConfig.onValue
				: this.toggleConfig.offValue;

			this.setStateProp(this.key, newVal);
		});
	}

	setStateProp(key, val) {
		appStore.setState({ [key]: val }, { global: true });
	}
}
