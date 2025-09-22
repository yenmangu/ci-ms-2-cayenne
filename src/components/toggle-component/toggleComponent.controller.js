/**
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
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
		this.subscription = appStore.subscribe(
			/** @param {AppState} state */ state => {
				console.log('State: ', state);

				this.latestState = state;
				this.toggleText = config[this.latestState[this.key]];

				if (this.toggle) {
					this.hydrate();
				}
			},
			true
		);

		this.init();
	}

	init() {
		console.debug(`ToggleComponent: ${this.toggleConfig.key}`);
		this.toggleWithWrapper = stringToHtml(
			renderToggleComponent(this.toggleConfig)
		);
	}

	render(refresh = false) {
		this.container.prepend(this.toggleWithWrapper);
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
		this.hydrate();
	}

	hydrate() {
		console.log(this.toggle.id);
		if (this.toggle.id !== 'measureSystem') {
			debugger;
		}
		this.toggle.checked =
			this.latestState[this.key] === this.toggleConfig.onValue;
		this.#_updateToggleText();
	}

	/**
	 *
	 * @param {string} key
	 * @param {*} val
	 */
	setStateProp(key, val) {
		appStore.setState({ [key]: val });
	}

	#_updateToggleText() {
		const label = document.querySelector(
			`label[for="${this.toggleConfig.key}"]`
		);
		if (!label) {
			throw new Error(`Label for toggle: ${this.key} not found`);
		}
		if (
			!this.toggleText ||
			this.toggleText === '' ||
			this.toggleText == undefined
		) {
			throw new Error(`ToggleText for toggle: ${this.key} not found`);
		}
		label.textContent = this.toggleText;
	}

	destroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
