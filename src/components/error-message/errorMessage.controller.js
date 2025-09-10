/**
 * @typedef {Object} ErrorMEssageConfig
 * @property {'network'|'not-found'|'generic'} type
 * @property {string|Error} error
 * @property {HTMLElement} container
 * @property {boolean} [includeRetry]
 * @property {string} [retryLabel]
 * @property {() => void} [retryCallback]
 * @property {string} [title]
 */

import { renderErrorMessage } from './errorMessage.view.js';

export class ErrorMessage {
	/**
	 * @param {ErrorMEssageConfig} config
	 */
	constructor(config) {
		this.type = config.type;
		this.message =
			typeof config.error === 'string'
				? config.error
				: config.error?.message || 'An unexpected error occurred.';
		this.container = config.container;
		this.includeRetry = config.includeRetry ?? false;
		this.retryLabel = config.retryLabel ?? 'Try Again';
		this.retryCallback = config.retryCallback || null;
		this.title = config.title || null;

		/** @private */
		this._boundRetryHandler = this._handleRetry.bind(this);
	}

	/**
	 * Render the error message into the containr
	 */
	render() {
		this.container.innerHTML = renderErrorMessage({
			type: this.type,
			title: this.title,
			message: this.message,
			includeRetry: this.includeRetry,
			retryLabel: this.retryLabel
		});

		if (this.includeRetry && this.retryCallback) {
			const btn = this.container.querySelector('[data-error-retry]');
			if (btn) {
				btn.addEventListener('click', this._boundRetryHandler);
			}
		}
	}

	destroy() {
		if (this.includeRetry && this.retryCallback) {
			const btn = this.container.querySelector('[data-error-retry]');
			if (btn) {
				btn.removeEventListener('click', this._boundRetryHandler);
			}
		}
		this.container.innerHTML = '';
	}

	/**
	 * @private
	 */
	_handleRetry() {
		if (this.retryCallback) {
			this.retryCallback();
		}
	}
}
