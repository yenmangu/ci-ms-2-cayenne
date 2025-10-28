/**
 * @typedef {import("../../types/stateTypes.js").UnitLocale} UnitLocale
 * @typedef {import("../../types/stateTypes.js").UnitLength} UnitLength
 */

/**
 * @typedef {object} ToggleConfig
 * @property {string} key
 * @property {string} onValue
 * @property {string} offValue
 * @property {UnitLocale | UnitLength} initialValue
 * @property {string}	[className] - Outer div class name
 * @property {string} [id] - Input Id
 * @property {string} [label] - Label text
 */

import { config as stateConfig } from '../../config/stateConfigs.js';

/**
 * Renders the ToggleComponent component to the DOM
 *
 * @param {ToggleConfig} config
 *
 */
export function renderToggleComponent(config) {
	if (!config || config == undefined) {
		throw new Error('Toggle config undefined');
	}

	return getTemplate(config);
}

/**
 *
 * @param {ToggleConfig} config
 * @returns {string} - HTML Template
 */
function getTemplate(config) {
	return `<div class="form-check form-switch ${config.className ?? ''}">
  <input class="form-check-input" type="checkbox" role="switch" id="${
		config.key
	}">
  <label class="form-check-label" for="${config.key}">${
		config.label ?? 'Test Toggle'
	}</label>
</div>
	`;
}
