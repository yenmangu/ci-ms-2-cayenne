/**
 * @typedef {object} ToggleConfig
 * @property {string} key
 * @property {string} onValue
 * @property {string} offValue
 * @property {string}	className - Outer div class name
 * @property {string} id - Input Id
 * @property {string} label - Label text
 */

/**
 * Renders the ToggleComponent component to the DOM
 *
 * @param {ToggleConfig} config
 *
 */

export function renderToggleComponent(config) {
	// TODO: implment view logic

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
		config.id ?? ''
	}">
  <label class="form-check-label" for="${config.id ?? ''}">${
		config.label ?? ''
	}</label>
</div>
	`;
}
