/**
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
 * @typedef {import('./toggleComponent.view.js').ToggleConfig} ToggleConfig
 */

import * as service from './toggleComponent.service.js';
import { appStore } from '../../appStore.js';
import { renderToggleComponent } from './toggleComponent.view.js';
import { stateValToUserText } from '../../config/stateConfigs.js';

export class ToggleComponent {
	/**
	 * @param {HTMLElement} container
	 * @param {{key?: string, config?: ToggleConfig}} [options={}]
	 */
	constructor(container, options = {}) {
		/** @type {HTMLElement} */
		this.container = container;

		this.toggleConfig = options.config;

		/** @type {HTMLInputElement} */
		this.toggle = null;
		this.stateKey = options.key;
		this.subscription = appStore.subscribe(
			/** @param {AppState} state */ state => {
				this.#_updateToggleText(state[this.stateKey]);
			}
		);
	}

	render() {
		this.container.innerHTML = '';
		this.container.innerHTML = renderToggleComponent(this.toggleConfig);
		this.toggle = /** @type {HTMLInputElement} */ (
			document.getElementById(this.toggleConfig.id)
		);
		this.toggle.addEventListener('change', e => {
			const newVal = this.toggle.checked
				? this.toggleConfig.onValue
				: this.toggleConfig.offValue;

			this.setStateProp(this.stateKey, newVal);
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {*} val
	 */
	setStateProp(key, val) {
		appStore.setState({ [key]: val });
	}

	#_updateToggleText(stateVal) {
		const textToUpdateWith = stateValToUserText[stateVal];
		this.toggleConfig.label = textToUpdateWith;
	}

	destroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
